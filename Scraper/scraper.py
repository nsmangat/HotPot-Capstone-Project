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
time.sleep(12)

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.NAME, "Q_f301a496-1419-4950-8605-ad11013358d7_0"))
)
potholeButtonName = "Q_f301a496-1419-4950-8605-ad11013358d7_0"
potholeButton = driver.find_element(By.NAME, "Q_f301a496-1419-4950-8605-ad11013358d7_0")
potholeButton.click()
