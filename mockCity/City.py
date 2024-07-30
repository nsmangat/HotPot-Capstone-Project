import psycopg2
import os
from dotenv import load_dotenv
from datetime import date, timedelta
import pandas as pd
import json
import requests
import google.generativeai as genai
import time

import logging



#Loading the env
load_dotenv()

#Environment variables
ORS_API_KEY = os.getenv("ORS_KEY")

#All the functions needed for the script

#Logger
def setup_logger(name, log_file, level=logging.DEBUG):    
    # Create a custom logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Create handlers
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(level)

    # Create a formatter and set it for the handler
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(file_handler)

    return logger

#Connection to the database
def get_connection(logger):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        logger.info("Connection established successfully!")
        return conn
    except Exception as e:
        print("Connection failed:", e)
        logger.error("Connection failed:", e)

#Settin gup the coordinates for the distance and time API
def setupCoordinates(json_data, df, logger):

    data = json.loads(json.dumps(json_data))

    order = []
    for item in data:
        order.append(item['pothole_id'])

    #print(order)

    #Sorting the df_twoPrep by the order using the order list as the index
    df_twoPrep = df[['pothole_id', 'coordinates']]
    df_twoPrep = df_twoPrep.set_index('pothole_id').loc[order].reset_index()
    df_twoPrep

    #iterating through the df_twoPrep and create a new list of coordinates, swapping the lat and long
    coordinates = []
    for index, row in df_twoPrep.iterrows():
        coordinates.append(row['coordinates'].split(','))
        coordinates[index] = [float(i) for i in coordinates[index]]
        coordinates[index] = [coordinates[index][1], coordinates[index][0]]
    
    logger.info("Coordinates setup successfully for DistanceTime API.")

    return coordinates, order

#Getting the distance and time from the API
def getDistanceTime(coordinates, logger):

    #set the headers and the payload
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        'Authorization': ORS_API_KEY
    }

    payload = {
        'coordinates': coordinates
    }

    #make the request
    response = requests.post('https://api.openrouteservice.org/v2/directions/driving-car/json', headers=headers, json=payload)
    response.json()

    distance = []
    duration = []

    for i in range(len(response.json()['routes'][0]['segments'])):
        distance.append(response.json()['routes'][0]['segments'][i]['distance'])
        duration.append(response.json()['routes'][0]['segments'][i]['duration'])

    distance
    duration

    duration.append(0)
    distance.append(0)

    logger.info("Distance and Time successfully retrieved from the API.")

    return distance, duration

#Converting the distance and time into a minutes and KM
def convertDistanceTime(distance, duration, order, df):
    df_three = df
    df_three = df_three.set_index('pothole_id').loc[order].reset_index()
    df_three['distance (meters)'] = distance
    df_three['duration (seconds)'] = duration
    #df_three

    df_three['distance (KM)'] = df_three['distance (meters)'] / 1000
    df_three['duration (MINS)'] = df_three['duration (seconds)'] / 60
    return df_three

#Converting the AI text response to JSON
def textToJson(response_text):
    start_index = response_text.find('json') + len('json\n')
    end_index = response_text.find('```', start_index)
    json_str = response_text[start_index:end_index].strip()
    pothole_data = json.loads(json_str)
    return pothole_data

#Getting the next day for the AI prompt
def getNextWorkingDay():
    tomorrow = date.today() + timedelta(days = 1)
    tomorrowDay = tomorrow.weekday() 
    if tomorrowDay == 5:
        tomorrow = tomorrow + timedelta(days = 2)
    elif tomorrowDay == 6:
        tomorrow = tomorrow + timedelta(days = 1)
    return tomorrow

#Write the estimated_fix_dates to the database
def writeEstimates(estimatedFixDates, logger):
    conn = get_connection(logger)

    cursor = conn.cursor()

    update_query = "UPDATE potholes SET estimated_fix_date = %s WHERE pothole_id = %s"

    #both wokr the same to add date
    data = [(item['EstimatedFixDate'], item['pothole_id']) for item in estimatedFixDates]
    #data = [(datetime.strptime(item['EstimatedFixDate'], '%Y-%m-%d').date(), item['pothole_id'],) for item in estimated_fix_dates]

    #Set to Null again
    #data = [(None, item['pothole_id'],) for item in estimated_fix_dates]

    try:
        cursor.executemany(update_query, data)
        conn.commit()  
        print("Records updated successfully!")
        logger.info("Estimates updated successfully!")
    except Exception as e:
        print("Failed to update records:", e)
        logger.error("Failed to update records with estimates:", e)
        conn.rollback() 

    cursor.close()
    conn.close()

def setEstimatesToNull(logger):
    conn = get_connection(logger)

    cursor = conn.cursor()

    try:
        cursor.execute("UPDATE potholes SET estimated_fix_date = NULL")
        conn.commit()  
        print("Records updated to Null successfully!")
        logger.info("Estimates set to Null successfully!")
    except Exception as e:
        print("Failed to update records:", e)
        logger.error("Failed to set estimates to Null:", e)
        conn.rollback() 

    cursor.close()
    conn.close()

def getAllPotholes(logger):
    conn = get_connection(logger)

    cursor = conn.cursor()

    cursor.execute("SELECT * FROM potholes")

    # Fetch results (if applicable)
    rows = cursor.fetchall()

    df = pd.DataFrame(rows, columns=[desc[0] for desc in cursor.description])
    cursor.close()
    conn.close()

    logger.info("All potholes retrieved successfully.")

    return df

def getSizeIDFirstDate(df):
    #Changing the first_reported_date column to just date
    for index, row in df.iterrows():
        df['first_reported_date'] =  pd.to_datetime(df['first_reported_date']).dt.date

    df = df[['pothole_id', 'pothole_size', 'first_reported_date']]
    return df

#Convert the dataframe to markdown for prompt
def df_to_markdown(df):
    """Converts a pandas DataFrame to a Markdown table string."""
    return df.to_markdown()


def AI():

    logger = setup_logger('AI', 'AI.log')

    #Get all the potholes
    df = getAllPotholes(logger)

    #Get the size, id and first date
    df_for_FirstPrompt = getSizeIDFirstDate(df)

    #First AI Prompt
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])

    # Create the model
    # See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
    generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    # safety_settings = Adjust safety settings
    # See https://ai.google.dev/gemini-api/docs/safety-settings
    )

    chat_session = model.start_chat(
    history=[]
    )

    prompt = f"""
    I have a dataset of potholes with the following columns:

    * pothole_id: Unique identifier for the pothole
    * pothole_size: Size of the pothole (Small, Medium, Large)
    * first_reported_date: Date the pothole was first reported

    Please prioritize the potholes for repair based on the following criteria:
    * Large potholes should be fixed within 7 days
    * Medium potholes should be fixed within 14 days
    * Small potholes should be fixed within 30 days

    I don't want code, I need you to internally prioritize and output the list of pothole IDs in the following JSON format:

    [
    {{"pothole_id": <pothole_id1>}},
    {{"pothole_id": <pothole_id2>}},
    ...
    ]

    Here's the dataset:
    {df_to_markdown(df_for_FirstPrompt)}
    """

    response = chat_session.send_message(prompt)
    # print("AI First Response:\n")
    # print(response.text)

    #First AI response to JSON
    pothole_data = textToJson(response.text)
    #print(pothole_data)
    logger.info("AI First Response successfull!")


    #Setup for 2nd AI Prompt
    coordinates, order = setupCoordinates(pothole_data, df, logger)

    distance, duration = getDistanceTime(coordinates, logger)

    df_for_SecondPrompt = convertDistanceTime(distance, duration, order, df_for_FirstPrompt)

    tomorrow = getNextWorkingDay()
    #print(tomorrow)

    #2nd AI Prompt
    prompt2 = f"""
    I have a dataset of potholes with details including size, reported date, distance to the next pothole, and travel time between them. Additionally, I have information about the road crew:

    Crew size: 1
    Fix times:
        Small pothole: 10 minutes
        Medium pothole: 15 minutes
        Large pothole: 20 minutes
    Work hours: 8:00 AM - 4:00 PM (with a 1-hour lunch break from 12:00 PM - 1:00 PM)
    Work days: Monday to Friday
    Assuming the crew starts work on {tomorrow} at 8:00 AM, I would like you to determine the estimated fix date for each pothole. Please consider travel time between potholes(using duration), work hours, and lunch break when calculating the estimated fix date.

    I don't want code, I need you to internally determine the estimated fix date for each pothole and output the list of pothole IDs in the following JSON format:

    [
    {{"pothole_id": <pothole_id1>,  "EstimatedFixDate": Date}},
    {{"pothole_id": <pothole_id2>,  "EstimatedFixDate": Date}},
    ...
    ]

    Here's the dataset:
    {df_to_markdown(df_for_SecondPrompt)}
    """

    response2 = chat_session.send_message(prompt2)

    #print(response2.text)

    estimated_fix_dates = textToJson(response2.text)
    estimated_fix_dates

    setEstimatesToNull(logger)

    writeEstimates(estimated_fix_dates, logger)

    #Print when the AI was last run
    print("AI was last run at: ", time.ctime())
    logger.info("AI finished run.")


while True:
    AI()
    time.sleep(30) #30seconds
