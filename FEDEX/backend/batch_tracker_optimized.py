#!/usr/bin/env python3
"""
OPTIMIZED BATCH TRACKING SYSTEM
Target: Process 250 rows in <10 minutes
Strategy: Provider-based parallelization with smart bot evasion
"""

import pandas as pd
import json
import time
import random
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import traceback
import os
from collections import defaultdict

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
    """
    Map Excel provider names to tracking functions
    Handles variations like 'COURIER WALA' vs 'COURIERWALA', FEDEX(ICL), etc.
    """
    provider_upper = str(provider_name).upper().strip()
    
    # Atlantic
    if 'ATLANTIC' in provider_upper:
        return get_atlantic_tracking_details
    
    # Courier Wala (handles both with and without space)
    if 'COURIER' in provider_upper and 'WALA' in provider_upper:
        return get_courierwala_tracking_details
    
    # DHL
    if provider_upper == 'DHL':
        return get_dhl_tracking_details
    
    # FedEx - handles FEDEX(564), FEDEX(3026), etc.
    if 'FEDEX' in provider_upper and 'ICL' not in provider_upper:
        return get_fedex_tracking_details
    
    # ICL - handles FEDEX(ICL)
    if 'ICL' in provider_upper:
        return get_icl_tracking_details
    
    # PXC Pacific
    if 'PXC' in provider_upper:
        return get_pxc_tracking_details
    
    # United Express (handles both with and without space)
    if 'UNITED' in provider_upper:
        return get_united_tracking_details
    
    raise ValueError(f"Unknown provider: {provider_name}")

CHECKPOINT_FILE = 'batch_processing_checkpoint.json'

class ProgressTracker:
    """Thread-safe progress tracker"""
    def __init__(self, total):
        self.total = total
        self.completed = 0
        self.failed = 0
        self.lock = threading.Lock()
        self.start_time = time.time()
    
    def update(self, success=True):
        with self.lock:
            if success:
                self.completed += 1
            else:
                self.failed += 1
            
            elapsed = time.time() - self.start_time
            rate = self.completed / elapsed if elapsed > 0 else 0
            remaining = (self.total - self.completed) / rate if rate > 0 else 0
            
            print(f"\r✓ {self.completed}/{self.total} | ✗ {self.failed} | "
                  f"Rate: {rate:.1f}/s | ETA: {remaining/60:.1f}m", end='', flush=True)

def create_driver(headless=True):
    """Create optimized Chrome driver instance"""
    chrome_options = Options()
    
    if headless:
        chrome_options.add_argument('--headless=new')
    
    # Performance optimizations
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-images')  # Faster loading
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-logging')
    chrome_options.add_argument('--log-level=3')
    chrome_options.add_argument('--window-size=1920,1080')
    
    # Bot evasion
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # Rotate user agents
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ]
    chrome_options.add_argument(f"user-agent={random.choice(user_agents)}")
    
    driver = webdriver.Chrome(options=chrome_options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    return driver

def process_single_shipment(row_data, provider_func, driver, progress):
    """Process a single shipment"""
    awb = row_data['awb']
    provider = row_data['provider']
    
    try:
        # Random delay to mimic human behavior (0.5-2 seconds)
        time.sleep(random.uniform(0.5, 2.0))
        
        result = provider_func(awb, driver)
        status = result.get('status', 'Unknown')
        
        progress.update(success=True)
        
        return {
            'index': row_data['index'],
            'awb': awb,
            'provider': provider,
            'status': status,
            'success': True,
            'result': result
        }
    
    except Exception as e:
        print(f"\n❌ Error processing {awb} ({provider}): {str(e)[:100]}")
        progress.update(success=False)
        
        return {
            'index': row_data['index'],
            'awb': awb,
            'provider': provider,
            'status': 'Error',
            'success': False,
            'error': str(e)
        }

def process_provider_batch(provider_name, shipments, progress, workers_per_provider=3):
    """Process all shipments for a single provider with multiple workers"""
    print(f"\n🔷 Starting {provider_name}: {len(shipments)} shipments with {workers_per_provider} workers")
    
    try:
        provider_func = get_provider_function(provider_name)
    except ValueError as e:
        print(f"\n❌ {e}")
        return []
    
    results = []
    
    # Create multiple drivers for this provider
    drivers = [create_driver() for _ in range(workers_per_provider)]
    
    try:
        with ThreadPoolExecutor(max_workers=workers_per_provider) as executor:
            futures = []
            
            for i, shipment in enumerate(shipments):
                # Assign driver in round-robin fashion
                driver = drivers[i % workers_per_provider]
                future = executor.submit(process_single_shipment, shipment, provider_func, driver, progress)
                futures.append(future)
            
            for future in as_completed(futures):
                result = future.result()
                results.append(result)
    
    finally:
        # Clean up drivers
        for driver in drivers:
            try:
                driver.quit()
            except:
                pass
    
    return results

def load_checkpoint():
    """Load processing checkpoint"""
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, 'r') as f:
            return json.load(f)
    return {'processed_indices': [], 'results': []}

def save_checkpoint(data):
    """Save processing checkpoint"""
    with open(CHECKPOINT_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def main():
    print("=" * 80)
    print("OPTIMIZED BATCH TRACKING SYSTEM")
    print("Strategy: Provider-based parallel processing")
    print("=" * 80)
    
    # Load dataset
    df = pd.read_excel('DataSet.xlsx')
    total_rows = len(df)
    
    print(f"\n📦 Total Shipments: {total_rows}")
    
    # Find AWB and Service Provider columns
    awb_col = next((col for col in df.columns if 'AWB' in col.upper()), None)
    provider_col = next((col for col in df.columns if 'SERVICE' in col.upper() or 'PROVIDER' in col.upper()), None)
    
    if not awb_col or not provider_col:
        print("❌ Could not find AWB or Service Provider column!")
        print(f"Available columns: {list(df.columns)}")
        return
    
    print(f"📋 AWB Column: {awb_col}")
    print(f"📋 Provider Column: {provider_col}")
    
    # Create STATUS column if missing
    if 'STATUS' not in df.columns:
        df['STATUS'] = ''
    
    # Load checkpoint
    checkpoint = load_checkpoint()
    processed_indices = set(checkpoint['processed_indices'])
    
    # Group by provider
    provider_groups = defaultdict(list)
    
    for idx, row in df.iterrows():
        if idx in processed_indices:
            continue
        
        awb = row[awb_col]
        provider = row[provider_col]
        
        if pd.notna(awb) and pd.notna(provider):
            provider_groups[provider].append({
                'index': idx,
                'awb': str(awb).strip(),
                'provider': provider
            })
    
    print(f"\n🔍 Provider Distribution:")
    for provider, shipments in provider_groups.items():
        print(f"   {provider}: {len(shipments)} shipments")
    
    pending_count = sum(len(s) for s in provider_groups.values())
    print(f"\n⏳ Pending: {pending_count} | Already Processed: {len(processed_indices)}")
    
    if pending_count == 0:
        print("\n✅ All shipments already processed!")
        return
    
    # Calculate optimal workers per provider
    # Target: 3 workers per provider for speed, but can adjust
    WORKERS_PER_PROVIDER = 3
    
    estimated_time = max(len(shipments) for shipments in provider_groups.values()) * 2.5 / WORKERS_PER_PROVIDER
    print(f"\n⏱️  Estimated completion time: {estimated_time/60:.1f} minutes")
    
    input("\nPress ENTER to start processing...")
    
    # Progress tracker
    progress = ProgressTracker(pending_count)
    all_results = checkpoint['results']
    
    start_time = time.time()
    
    # Process each provider in parallel
    with ThreadPoolExecutor(max_workers=len(provider_groups)) as executor:
        provider_futures = {}
        
        for provider_name, shipments in provider_groups.items():
            future = executor.submit(process_provider_batch, provider_name, shipments, progress, WORKERS_PER_PROVIDER)
            provider_futures[future] = provider_name
        
        for future in as_completed(provider_futures):
            provider_name = provider_futures[future]
            try:
                results = future.result()
                all_results.extend(results)
                
                # Update checkpoint
                processed_indices.update([r['index'] for r in results])
                save_checkpoint({
                    'processed_indices': list(processed_indices),
                    'results': all_results
                })
                
                print(f"\n✅ Completed {provider_name}")
            
            except Exception as e:
                print(f"\n❌ Provider {provider_name} failed: {e}")
    
    print("\n\n" + "=" * 80)
    print("UPDATING EXCEL FILE...")
    print("=" * 80)
    
    # Update Excel with results
    for result in all_results:
        if result['success']:
            df.at[result['index'], 'STATUS'] = result['status']
    
    df.to_excel('DataSet.xlsx', index=False)
    
    elapsed = time.time() - start_time
    
    print(f"\n✅ PROCESSING COMPLETE!")
    print(f"⏱️  Total Time: {elapsed/60:.2f} minutes")
    print(f"✓ Successful: {progress.completed}")
    print(f"✗ Failed: {progress.failed}")
    print(f"📁 Updated: DataSet.xlsx")
    
    # Clean up checkpoint
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)

if __name__ == "__main__":
    main()
