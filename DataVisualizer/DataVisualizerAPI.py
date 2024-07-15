from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import matplotlib
matplotlib.use('Agg') #need this line, else matplotlib gui warning and app crashes after a few fetches 
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
import pandas as pd
import os
from io import BytesIO
from sqlalchemy import func
from dotenv import load_dotenv
import datetime
import base64
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials

#initial setup stuff
app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#Firebase stuff
service_account_key =  os.path.join(os.getcwd(), 'config', 'serviceAccountKey.json')
cred = credentials.Certificate(service_account_key)
firebase_admin.initialize_app(cred)

#Define the models to make DB calls for the specific tables that'll be used
class Pothole(db.Model):
    __tablename__ = 'potholes'
    pothole_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pothole_size = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    first_reported_date = db.Column(db.Date, nullable=False, default=func.now())
    number_of_reports = db.Column(db.Integer, nullable=False)
    coordinates = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    is_fixed = db.Column(db.Boolean, nullable=False)
    is_reported = db.Column(db.Boolean, nullable=False)
    updated_at = db.Column(db.Date, nullable=False, default=func.now())

class Report(db.Model):
    __tablename__ = 'reports'
    report_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pothole_id = db.Column(db.Integer, db.ForeignKey('potholes.pothole_id'), nullable=False)
    firebase_uid = db.Column(db.String, nullable=False)  
    time_reported = db.Column(db.Date, nullable=False, default=func.now())

    pothole = db.relationship('Pothole', backref='reports')  

def get_all_potholes():
    return Pothole.query.all()

def get_potholes_by_userid(firebase_uid):
    return db.session.query(Pothole).join(Report).filter(Report.firebase_uid == firebase_uid).all()

#Dates for the last 4 weeks, if change timeframe in the future do it here
def get_last_4_weeks():
    today = datetime.date.today()
    four_weeks_ago = today - datetime.timedelta(weeks=4)

    return four_weeks_ago

#Get the count of all pothole reports in the timeframe
def global_get_pothole_count_by_day():
    dates_in_last_4_weeks = get_last_4_weeks()

    pothole_dates = db.session.query(
        func.date_trunc('day', Pothole.first_reported_date).label('date'),
        func.count(Pothole.pothole_id).label('count')
    ).filter(Pothole.first_reported_date >= dates_in_last_4_weeks).group_by(
        func.date_trunc('day', Pothole.first_reported_date)
    ).order_by('date').all()

    counts_by_date = [{'date': date.date, 'count': date.count} for date in pothole_dates]

    return pd.DataFrame(counts_by_date)

#Get the count of pothole reports by the user in the timeframe
def user_get_pothole_count_by_day(firebase_uid):
    dates_in_last_4_weeks = get_last_4_weeks()

    user_pothole_dates = db.session.query(
        func.date_trunc('day', Pothole.first_reported_date).label('date'),
        func.count(Pothole.pothole_id).label('count')
    ).join(Report).filter(Report.firebase_uid == firebase_uid, Pothole.first_reported_date >= dates_in_last_4_weeks).group_by(
        func.date_trunc('day', Pothole.first_reported_date)
    ).order_by('date').all()

    user_counts_by_date = [{'date': date.date, 'count': date.count} for date in user_pothole_dates]

    return pd.DataFrame(user_counts_by_date)

#Get the fix status of all potholes in the timeframe
def get_global_pothole_fix_status():
    dates_in_last_4_weeks = get_last_4_weeks()

    fixed = db.session.query(
        func.count(Pothole.pothole_id)
        ).filter(Pothole.is_fixed == True, Pothole.first_reported_date >= dates_in_last_4_weeks).scalar()
    not_fixed = db.session.query(func.count(Pothole.pothole_id)
                                 ).filter(Pothole.is_fixed == False, Pothole.first_reported_date >= dates_in_last_4_weeks).scalar()
    
    return fixed, not_fixed

#Get the fix status of potholes by the user in the timeframe
def get_user_pothole_fix_status(firebase_uid):
    dates_in_last_4_weeks = get_last_4_weeks()

    fixed = db.session.query(func.count(Pothole.pothole_id)
                             ).join(Report).filter(Report.firebase_uid == firebase_uid, Pothole.is_fixed == True, Pothole.first_reported_date >= dates_in_last_4_weeks).scalar()
    not_fixed = db.session.query(func.count(Pothole.pothole_id)
                                 ).join(Report).filter(Report.firebase_uid == firebase_uid, Pothole.is_fixed == False, Pothole.first_reported_date >= dates_in_last_4_weeks).scalar()
    
    return fixed, not_fixed

#Make the piechart for the fix status
def create_pie_chart(data, labels, title):
    fig, ax = plt.subplots()
    ax.pie(data, labels=labels, autopct='%1.2f%%', startangle=90)
    ax.axis('equal')
    plt.title(title)

    #Save the pie chart to a BytesIO object, then png image to later be converted to base64
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close(fig)
    return img

#Make the line graph for the number of pothole reports
def create_line_graph(dataframe, title):
    fig, ax = plt.subplots()

    dataframe.plot(kind='line', x='date', y='count', ax=ax)

    #Whole numbers only for the pothole count
    ax.yaxis.set_major_locator(MaxNLocator(integer=True))  

    #Get rid of the default legend
    ax.get_legend().remove()
    
    plt.title(title)
    plt.xlabel('Date')
    plt.ylabel('Number of Potholes')

    #Save the line graph to a BytesIO object, then png image to later be converted to base64
    img = BytesIO()
    plt.savefig(img, format='png')

    #Set to 0 so when the image is read on frontend, it starts from the beginning i.e. like a file pointer
    img.seek(0)
    plt.close(fig)

    return img


@app.route('/visualize', methods=['GET'])
def visualize():
    firebase_authentication = request.headers.get('Authorization')
    firebase_uid = None

    if firebase_authentication:
        try:
            #Get the firebase info from the header
            firebase_token = firebase_authentication.split(' ')[1]

            #Authorize
            decoded_token = auth.verify_id_token(firebase_token)
            firebase_uid = decoded_token['uid']

        except Exception as e:
            print(f"Authentication error: {e}")    

    #Get the global potholes count df then pass it to the line graph function to produce the line graph img
    df_pothole_reports_by_day_count = global_get_pothole_count_by_day()
    global_pothole_count_line_graph_img = create_line_graph(df_pothole_reports_by_day_count, 'Global Pothole Reports (Last 4 Weeks)')

#    #Get the global fix status of potholes then pass it to the pie chart function to produce the pie chart img
    fixed, unfixed = get_global_pothole_fix_status()
    global_fixed_vs_unfixed_pie_chart_img = create_pie_chart([fixed, unfixed], ['Fixed', 'Unfixed'], 'Global Fixed vs Unfixed Potholes (Last 4 weeks)')

    #If the user is authenticated successfully, then get the user specific graphs
    user_pothole_count_line_graph_img, user_fixed_vs_unfixed_pie_chart_img = None, None

    if firebase_uid is not None:
        df_user_pothole_reports_by_day_count = user_get_pothole_count_by_day(firebase_uid)
        user_pothole_count_line_graph_img = create_line_graph(df_user_pothole_reports_by_day_count, 'Potholes Reported by You (Last 4 weeks)')

        fixed_user, unfixed_user = get_user_pothole_fix_status(firebase_uid)
        user_fixed_vs_unfixed_pie_chart_img = create_pie_chart([fixed_user, unfixed_user], ['Fixed', 'Unfixed'], 'Fixed vs Unfixed Potholes You Have Reported (Last 4 Weeks)')

    #Convert all of the images to base64 (basically a giant string of characters that represent the image) which will be converted back to images on the frontend
    global_pothole_count_line_graph_img_base64 = base64.b64encode(global_pothole_count_line_graph_img.getvalue()).decode()
    global_fixed_vs_unfixed_pie_chart_img_base64 = base64.b64encode(global_fixed_vs_unfixed_pie_chart_img.getvalue()).decode()
    user_pothole_count_line_graph_img_base64 = base64.b64encode(user_pothole_count_line_graph_img.getvalue()).decode() if user_pothole_count_line_graph_img else None
    user_fixed_vs_unfixed_pie_chart_img_base64 = base64.b64encode(user_fixed_vs_unfixed_pie_chart_img.getvalue()).decode() if user_fixed_vs_unfixed_pie_chart_img else None

    return jsonify({
        'global_pothole_count_line_graph': global_pothole_count_line_graph_img_base64,
        'global_fixed_vs_unfixed_pie_chart': global_fixed_vs_unfixed_pie_chart_img_base64,
        'user_pothole_count_line_graph': user_pothole_count_line_graph_img_base64,
        'user_fixed_vs_unfixed_pie_chart': user_fixed_vs_unfixed_pie_chart_img_base64
    })


if __name__ == '__main__':
    # Might have to change port to not conflict with scraper?
    app.run(debug=True, host='0.0.0.0', port=5000)
