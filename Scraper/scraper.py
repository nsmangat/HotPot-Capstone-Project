from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def submitForm(location, description, size):
    try:
        #Driver for debugging
        # options = Options()
        # options.add_experimental_option("detach", True)
        # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

        #Main Driver(Chrome Window)
        #driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

        #Headless Driver
        options = Options()
        options.add_argument("--headless")
        options.add_argument('log-level=2')
        options.add_argument("--window-size=1920,1080")

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

        #URL to City of Kitchener Report a Problem
        url = "https://form.kitchener.ca/CSD/CCS/Report-a-problem"

        #Opening the Webpage for Kitchener Report a Problem
        driver.get(url)

        #Waiting for the page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "Q_f301a496-1419-4950-8605-ad11013358d7_0"))
        )

        #Accepting the cookies
        try:
            cookie_banner = driver.find_element(By.CLASS_NAME, "cc-compliance")
            cookie_banner.click()
        except:
            print("No cookie banner found")

        #Clicking on the Pothole Button
        potholeButtonXpath = '//*[@id="C_f301a496-1419-4950-8605-ad11013358d7_0"]/div/div/fieldset/div[8]/div/div/label/input'
        potholeButton = driver.find_element(By.XPATH, potholeButtonXpath)
        potholeButton.click()

        #Clicking on the Continue Button
        continueButtonXpath = '//*[@id="_Form"]/div[2]/div/div/div/div/button'
        continueButton = driver.find_element(By.XPATH, continueButtonXpath)
        continueButton.click()

        #Waiting for the page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "Q_be887341-c392-4d88-acda-ad11013b0cd0_0"))
        )

        #Entering the location of the pothole
        locationField = driver.find_element(By.ID, "Q_be887341-c392-4d88-acda-ad11013b0cd0_0")
        #locationInput = "1234 Test Street"
        locationField.send_keys(location)

        #Entering the description of the pothole
        descriptionField = driver.find_element(By.ID, "Q_41f30d61-e166-40b6-9e18-ad11013b3b59_0")
        #descriptionInput = "Middle Lane"
        descriptionField.send_keys(description)

        #Entering the size of the pothole
        sizeField = driver.find_element(By.ID, "Q_70ecb92a-793c-4dee-b6e4-ad11013b58dc_0")
        #sizeInput = "Large"
        sizeField.send_keys(size)

        #Button for option to submit picture
        submitPictureButtonXpath = '//*[@id="C_afafc15c-2411-4c02-9196-ecc43c27fea9_0"]/div/div/fieldset/div[3]/div/div/label/input'
        submitPictureButton = driver.find_element(By.XPATH, submitPictureButtonXpath)
        submitPictureButton.click()

        #Clicking on the Continue Button
        pageTwoContinueButtonXpath = '//*[@id="_Form"]/div[2]/div/div/div[1]/div/button'
        pageTwoContinueButton = driver.find_element(By.XPATH, pageTwoContinueButtonXpath)
        pageTwoContinueButton.click()

        #Check the page
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="C_300444a0-4c4d-4368-a454-cff3e48d1344_0"]/div/div/h2'))
        )

        #Check Title on final Page to confirm submission
        finalPageTitle = driver.find_element(By.XPATH, '//*[@id="C_300444a0-4c4d-4368-a454-cff3e48d1344_0"]/div/div/h2')
        title = finalPageTitle.text
        print(title)

        time.sleep(5)
        driver.quit()

        if title != "Contact information (optional)":
            return False
        else:
            return True
    
    except Exception as e:
        # print("Error submitting form")
        print(e)
        return False


# check = submitForm("1234 Test Street", "Middle Lane", "Large")
# if check:
#     print("Form Submitted")
# else:
#     print("Error submitting form")