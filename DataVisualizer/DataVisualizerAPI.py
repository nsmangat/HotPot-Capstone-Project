from flask import Flask, jsonify, request, send_file, render_template_string
from flask_sqlalchemy import SQLAlchemy
import matplotlib.pyplot as plt
import pandas as pd
import os
from io import BytesIO
from sqlalchemy import func
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

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

def create_line_graph_of_number_of_potholes_by_date(dataframe):
    # Can use this to make multiple subplots in 1 image I think
    fig, ax = plt.subplots()

    #Doing it this way spaces out the x axis nicely compared to the commented out line below
    dataframe.plot(kind='line', x='date', y='count', ax=ax)
    # plt.plot(dataframe['date'], dataframe['count'])
    plt.title('Potholes Reported Over Time')
    plt.xlabel('Date')
    plt.ylabel('Number of Potholes')

    img = BytesIO()
    plt.savefig(img, format='png')

    #reset the file pointer to the beginning of the image to prepare it for sending from the beginning since BytesIO leaves it at the end
    img.seek(0)
    plt.close(fig)

    return img

@app.route('/visualize', methods=['GET'])
def visualize():
    df_pothole_reports_by_day_count = global_get_pothole_count_by_day()
    img = create_line_graph_of_number_of_potholes_by_date(df_pothole_reports_by_day_count)

    return send_file(img, mimetype='image/png')



if __name__ == '__main__':
    app.run(debug=True)
