from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

# Test with the first DHL AWB
awb = "1509484944"

chrome_options = Options()
# Remove headless to see what's happening
# chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--window-size=1920,1080')

driver = webdriver.Chrome(options=chrome_options)

try:
    # Navigate directly to tracking results URL
    tracking_url = f"https://www.dhl.com/in-en/home/tracking.html?tracking-id={awb}&submit=1"
    print(f"Navigating to: {tracking_url}")
    driver.get(tracking_url)
    
    # Wait for page to load
    print("Waiting 15 seconds for page to load...")
    time.sleep(15)
    
    # Get page text
    page_text = driver.find_element(By.TAG_NAME, "body").text
    
    # Save to file
    with open('dhl_page_debug.txt', 'w', encoding='utf-8') as f:
        f.write(f"URL: {tracking_url}\n")
        f.write("="*80 + "\n")
        f.write(page_text)
    
    print(f"\nPage text saved to dhl_page_debug.txt ({len(page_text)} characters)")
    print("\nFirst 500 characters:")
    print(page_text[:500])
    
    # Also save HTML
    html = driver.page_source
    with open('dhl_page_debug.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\nHTML saved to dhl_page_debug.html ({len(html)} characters)")
    
    # Take screenshot
    driver.save_screenshot('dhl_page_debug.png')
    print("\nScreenshot saved to dhl_page_debug.png")
    
    print("\n✅ Debug files created successfully!")
    print("Please check the files to see what DHL is returning.")
    
finally:
    input("\nPress Enter to close browser...")
    driver.quit()
