from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = Options()
options.add_experimental_option("detach", True)

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

#URL to City of Kitchener Report a Problem
url = "https://form.kitchener.ca/CSD/CCS/Report-a-problem"

#Opening the Webpage for Kitchener Report a Problem
driver.get(url)

# WebDriverWait(driver, 10).until(
#     EC.presence_of_element_located((By.NAME, "Q_f301a496-1419-4950-8605-ad11013358d7_0"))
# )
# potholeButtonName = "Q_f301a496-1419-4950-8605-ad11013358d7_0"
# potholeButton = driver.find_element(By.NAME, potholeButtonName)
# potholeButton.click()

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