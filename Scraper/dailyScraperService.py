import time
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pandas as pd
import logging

from scraper import submitForm

# def submitForm(location, description, size):
# location = Address
# description = descriptio
# size = pothole_size

#Loading the env
load_dotenv()

def time_until_next_3am():
    now = datetime.now()
    next_1am = now.replace(hour=3, minute=0, second=0, microsecond=0)
    if now >= next_1am:
        next_1am += timedelta(days=1)
    return (next_1am - now).total_seconds()

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

def close_logger(logger):
    handlers = logger.handlers[:]
    for handler in handlers:
        handler.close()
        logger.removeHandler(handler)

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
        logger.error(f"Connection failed: {e}")
        

def getAllPotholesToReport(logger):
    conn = get_connection(logger)

    cursor = conn.cursor()
    
    query = """
        SELECT pothole_id, pothole_size, description, address FROM potholes 
        WHERE is_reported = false
        """
    #Execute query with WHERE clause filtering for is_fixed=False and estimated_fix_date=today
    cursor.execute(query)

    # Fetch results (if applicable)
    rows = cursor.fetchall()

    df = pd.DataFrame(rows, columns=[desc[0] for desc in cursor.description])
    cursor.close()
    conn.close()

    if df.empty:
        logger.info("No potholes received from DB.")
    else:
        logger.info("All potholes that need to reported retrieved successfully.")

    return df

def setToReported(successIDS, logger):
    conn = get_connection(logger)

    cursor = conn.cursor()

    update_query = "UPDATE potholes SET is_reported = true WHERE pothole_id = %s"

    #Pothole IDs to be updated
    data = [(pothole_id,) for pothole_id in successIDS]

    try:
        cursor.executemany(update_query, data)
        conn.commit()  
        logger.info("Report Status updated successfully!")
        
    except Exception as e:
        print("Failed to update records:", e)
        logger.error(f"Failed to update records with Report Status: {e}")
        conn.rollback() 

    cursor.close()
    conn.close()
    
    

def ReportPotholes(time):
    logger = setup_logger("ReportPotholes", "ReportPotholes.log")
    #All the potholes that need to be reported
    df = getAllPotholesToReport(logger)
    
    #check if df is empty
    if df.empty:
        logger.info("No potholes to report today.")
        logger.info("Last run at: " + str(time))
        close_logger(logger)
        return
    
    successIDS = []

    for index, row in df.iterrows():
        try:
            result = submitForm(row['address'], row['description'], row['pothole_size'])
            
            if result:
                successIDS.append(row['pothole_id'])
                 
            setToReported(successIDS, logger)
            
            close_logger(logger)
        except Exception as e:
            # print("Failed to submit form:", e)
            logger.error(f"Failed to submit form: {e}")
    
    logger.info("Last run at: " + str(time))
            

    

while True:
    # Wait until 3 AM
    wait_seconds = time_until_next_3am()

    logger = setup_logger("ReportPotholes", "ReportPotholes.log")
    message = "Waiting for 3AM to fix potholes, " + str(wait_seconds) + " seconds left."
    logger.info(message)
    close_logger(logger)

    time.sleep(wait_seconds)

    #Report potholes
    now = datetime.now()
    ReportPotholes(now)
    
    
    # Wait for 24 hours until the next 3AM
    time.sleep(24 * 3600 - wait_seconds)