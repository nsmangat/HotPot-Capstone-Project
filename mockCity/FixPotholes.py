import time
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pandas as pd
import logging

#Loading the env
load_dotenv()

def time_until_next_1am():
    now = datetime.now()
    next_1am = now.replace(hour=1, minute=0, second=0, microsecond=0)
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



def getAllPotholesToFix(logger):
    conn = get_connection(logger)

    cursor = conn.cursor()
    # Get today's date in YYYY-MM-DD format
    today = datetime.today().date()
    query = """
        SELECT * FROM potholes 
        WHERE is_fixed = false 
        AND estimated_fix_date = %s
        """
    #Execute query with WHERE clause filtering for is_fixed=False and estimated_fix_date=today
    cursor.execute(query, (today,))

    # Fetch results (if applicable)
    rows = cursor.fetchall()

    df = pd.DataFrame(rows, columns=[desc[0] for desc in cursor.description])
    cursor.close()
    conn.close()

    if df.empty:
        logger.info("No potholes received from DB.")
    else:
        logger.info("All potholes that need to set to fixed retrieved successfully.")

    return df

def setToFixed(df, logger):
    conn = get_connection(logger)

    cursor = conn.cursor()

    update_query = "UPDATE potholes SET is_fixed = true WHERE pothole_id = %s"

    #both wokr the same to add date
    data = [(row['pothole_id'],) for _, row in df.iterrows()]
    #data = [(datetime.strptime(item['EstimatedFixDate'], '%Y-%m-%d').date(), item['pothole_id'],) for item in estimated_fix_dates]

    #Set to Null again
    #data = [(None, item['pothole_id'],) for item in estimated_fix_dates]

    try:
        cursor.executemany(update_query, data)
        conn.commit()  
        print("Records updated successfully!")
        logger.info("Fix Status updated successfully!")
    except Exception as e:
        print("Failed to update records:", e)
        logger.error(f"Failed to update records with Fix Status: {e}")
        conn.rollback() 

    cursor.close()
    conn.close()


def fixPotholes(time):
    #setting up logger
    logger = setup_logger("FixPotholes", "FixPotholes.log")

    #getting all potholes that need to be set to fixed
    df = getAllPotholesToFix(logger)

    #check if df is empty
    if df.empty:
        logger.info("No potholes to fix today.")
        logger.info("Last run at: " + str(time))
        close_logger(logger)
        return

    #setting all potholes to fixed
    setToFixed(df, logger)

    logger.info("Last run at: " + str(time))

    close_logger(logger)

while True:
    # Wait until 1 AM
    wait_seconds = time_until_next_1am()

    logger = setup_logger("FixPotholes", "FixPotholes.log")
    message = "Waiting for 1AM to fix potholes, " + str(wait_seconds) + " seconds left."
    logger.info(message)
    close_logger(logger)

    time.sleep(wait_seconds)

    #Fix potholes
    now = datetime.now()
    fixPotholes(now)
    
    # Wait for 24 hours until the next 1 AM
    time.sleep(24 * 3600 - wait_seconds)
