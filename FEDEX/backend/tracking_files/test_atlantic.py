import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import sys

# Import the tracking function from the main script
sys.path.append('.')
from update_atlantic_tracking import get_atlantic_tracking_details

# Test the problematic AWB numbers
test_awbs = [9221060847, 9221061205, 9221065431]

print("Testing problematic AWB numbers...")
print("=" * 70)

# Setup Chrome driver
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--window-size=1920,1080')

driver = webdriver.Chrome(options=chrome_options)

try:
    for awb in test_awbs:
        print(f"\nTesting AWB: {awb}")
        result = get_atlantic_tracking_details(awb, driver)
        print(f"  Status: {result['status']}")
        print(f"  Has Timeline: {len(result['timeline']) > 0}")
        if result['destination']:
            print(f"  Destination: {result['destination']}")
finally:
    driver.quit()

print("\n" + "=" * 70)
print("Test complete!")
