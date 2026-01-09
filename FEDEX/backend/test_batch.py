#!/usr/bin/env python3
"""
TEST RUN - Process first 5 rows to verify setup
"""

import pandas as pd
import json
import time
import random
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import traceback

# Import all tracking modules
from update_atlantic_tracking import get_atlantic_tracking_details
from update_courierwala_tracking import get_courierwala_tracking_details
from update_dhl_tracking import get_dhl_tracking_details
from update_fedex_tracking import get_fedex_tracking_details
from update_icl_tracking import get_icl_tracking_details
from update_pxc_tracking import get_pxc_tracking_details
from update_united_tracking import get_united_tracking_details

# Provider mapping - handles all Excel variations
def get_provider_function(provider_name):
    """Map Excel provider names to tracking functions"""
    provider_upper = str(provider_name).upper().strip()
    
    if 'ATLANTIC' in provider_upper:
        return get_atlantic_tracking_details
    if 'COURIER' in provider_upper and 'WALA' in provider_upper:
        return get_courierwala_tracking_details
    if provider_upper == 'DHL':
        return get_dhl_tracking_details
    if 'FEDEX' in provider_upper and 'ICL' not in provider_upper:
        return get_fedex_tracking_details
    if 'ICL' in provider_upper:
        return get_icl_tracking_details
    if 'PXC' in provider_upper:
        return get_pxc_tracking_details
    if 'UNITED' in provider_upper:
        return get_united_tracking_details
    
    raise ValueError(f"Unknown provider: {provider_name}")

def create_driver():
    """Create Chrome driver"""
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

print("=" * 80)
print("TEST RUN - Processing first 5 rows")
print("=" * 80)

# Load dataset
df = pd.read_excel('DataSet.xlsx')
print(f"\n📦 Total Shipments in file: {len(df)}")

# Find columns
awb_col = next((col for col in df.columns if 'AWB' in col.upper()), None)
provider_col = next((col for col in df.columns if 'SERVICE' in col.upper() or 'PROVIDER' in col.upper()), None)

if not awb_col or not provider_col:
    print("❌ Could not find AWB or Provider column!")
    print(f"Available columns: {list(df.columns)}")
    exit(1)

print(f"📋 AWB Column: {awb_col}")
print(f"📋 Provider Column: {provider_col}")

# Create STATUS column if missing
if 'STATUS' not in df.columns:
    df['STATUS'] = ''

# Process only first 5 rows
test_df = df.head(5)
print(f"\n🧪 Testing with {len(test_df)} rows:")

driver = create_driver()

try:
    for idx, row in test_df.iterrows():
        awb = str(row[awb_col]).strip()
        provider = row[provider_col]
        
        print(f"\n[{idx+1}/5] Processing:")
        print(f"  AWB: {awb}")
        print(f"  Provider: {provider}")
        
        try:
            provider_func = get_provider_function(provider)
            result = provider_func(awb, driver)
            status = result.get('status', 'Unknown')
            
            df.at[idx, 'STATUS'] = status
            print(f"  ✓ Status: {status}")
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)[:100]}")
            df.at[idx, 'STATUS'] = 'Error'
        
        time.sleep(2)  # Small delay
    
    # Save results
    df.to_excel('DataSet.xlsx', index=False)
    print("\n✅ Test complete! Check the first 5 rows in DataSet.xlsx")
    print("\nIf this works, run the full batch_tracker_optimized.py")

finally:
    driver.quit()
