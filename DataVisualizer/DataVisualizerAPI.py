from flask import Flask, jsonify, request, send_file, render_template_string
from flask_sqlalchemy import SQLAlchemy
import matplotlib
matplotlib.use('Agg') #need this line, else matplotlib gui warning and app crashes after a few fetches 
import matplotlib.pyplot as plt
import pandas as pd
import os
from io import BytesIO
from sqlalchemy import func
from dotenv import load_dotenv

import base64
import firebase_admin
from firebase_admin import auth
from firebase_admin import credentials


app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#Firebase stuff
service_account_key =  os.path.join(os.getcwd(), 'config', 'serviceAccountKey.json')
cred = credentials.Certificate(service_account_key)
firebase_admin.initialize_app(cred)

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

#Get the count of pothole reports by day
def global_get_pothole_count_by_day():
    pothole_dates = db.session.query(
        func.date_trunc('day', Pothole.first_reported_date).label('date'),
        func.count(Pothole.pothole_id).label('count')
    ).group_by(
        func.date_trunc('day', Pothole.first_reported_date)
    ).order_by('date').all()

    counts_by_date = [{'date': date.date, 'count': date.count} for date in pothole_dates]
    return pd.DataFrame(counts_by_date)

def user_get_pothole_count_by_day(firebase_uid):
    user_pothole_dates = db.session.query(
        func.date_trunc('day', Pothole.first_reported_date).label('date'),
        func.count(Pothole.pothole_id).label('count')
    ).join(Report).filter(Report.firebase_uid == firebase_uid).group_by(
        func.date_trunc('day', Pothole.first_reported_date)
    ).order_by('date').all()

    user_counts_by_date = [{'date': date.date, 'count': date.count} for date in user_pothole_dates]
    return pd.DataFrame(user_counts_by_date)

# def create_line_graph_of_number_of_potholes_by_date(dataframe, plot_title):
#     # Can use this to make multiple subplots in 1 image I think
#     fig, ax = plt.subplots()

#     #Doing it this way spaces out the x axis nicely compared to the commented out line below
#     dataframe.plot(kind='line', x='date', y='count', ax=ax)
#     # plt.plot(dataframe['date'], dataframe['count'])
#     plt.title('Potholes Reported Over Time')
#     plt.xlabel('Date')
#     plt.ylabel('Number of Potholes')

#     img = BytesIO()
#     plt.savefig(img, format='png')

#     #reset the file pointer to the beginning of the image to prepare it for sending from the beginning since BytesIO leaves it at the end
#     img.seek(0)
#     plt.close(fig)

#     return img

def create_line_graph_subplots(global_pothole_dates, user_pothole_dates=None):
    fig, axes = plt.subplots(nrows=2, ncols=1, figsize=(8, 8))

    global_pothole_dates.plot(kind='line', x='date', y='count', ax=axes[0])
    axes[0].legend([])
    axes[0].set_title('All Potholes Reported Over Time')
    axes[0].set_xlabel('Date')
    axes[0].set_ylabel('Number of Potholes')

    if user_pothole_dates is not None:
        user_pothole_dates.plot(kind='line', x='date', y='count', ax=axes[1])
        axes[1].legend([])
        axes[1].set_title('Potholes Reported by You')
        axes[1].set_xlabel('Date')
        axes[1].set_ylabel('Number of Potholes')


    plt.tight_layout()
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close(fig)
    return img


@app.route('/visualize', methods=['GET'])
def visualize():
    firebase_authentication = request.headers.get('Authorization')
    firebase_uid = None

    if firebase_authentication:
        try:
            # Extract the Firebase ID token from the Authorization header
            firebase_token = firebase_authentication.split(' ')[1]

            # Verify the ID token and get the user's Firebase UID
            decoded_token = auth.verify_id_token(firebase_token)
            firebase_uid = decoded_token['uid']
        except Exception as e:
            print(f"Authentication error: {e}")    
    
    print("firebase id is", firebase_uid)


    df_pothole_reports_by_day_count = global_get_pothole_count_by_day()
    print(df_pothole_reports_by_day_count.head(5))

    if firebase_uid is not None:
        df_user_pothole_reports_by_day_count = user_get_pothole_count_by_day(firebase_uid)
        print(df_user_pothole_reports_by_day_count.head(5))
    else:
        df_user_pothole_reports_by_day_count = None


    # img_global_count_potholes = create_line_graph_of_number_of_potholes_by_date(df_pothole_reports_by_day_count, 'Potholes Reported Over Time')
    # img_user_count_potholes = create_line_graph_of_number_of_potholes_by_date(df_user_pothole_reports_by_day_count, 'Potholes Reported by You')


    image_data_visualizations = create_line_graph_subplots(df_pothole_reports_by_day_count, df_user_pothole_reports_by_day_count)
    # image_data_visualizations = create_line_graph_subplots(df_pothole_reports_by_day_count)



    # return send_file(image_data_visualizations, mimetype='image/png')

    img_base64  = base64.b64encode(image_data_visualizations.getvalue()).decode()
    return render_template_string('<img src="data:image/png;base64,{{ base64 }}">', base64=img_base64 )



if __name__ == '__main__':
    # Might have to chance port to not conflict with scraper?
    app.run(debug=True, host='0.0.0.0', port=5000)


#get rid of the legend in the graph
