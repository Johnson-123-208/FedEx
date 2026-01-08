import pandas as pd
import os
import time
from fedex_service import FedExTrackingService

# CONFIGURATION
# Using credentials provided by user
CLIENT_ID = "l7a73775cf9a4747f088941551364be841"
CLIENT_SECRET = "ae5732d59f8a49a78891e6d764febf02"
FEDEX_ENV = "sandbox" # Changed to sandbox to match provided credentials

def process_excel_tracking(file_path):
    print(f"🚀 Starting High-Performance FedEx Tracking for: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return

    # 1. Load Data
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        print(f"❌ Error reading Excel: {e}")
        return

    # Normalize Columns
    awb_col = None
    status_col = 'STATUS'
    location_col = 'Current Location'
    update_col = 'Last Update'
    
    # Find AWB Column
    possible_cols = ['AWBNO.', 'AWB Number', 'Tracking Number', 'AWB']
    for c in df.columns:
        if any(x in str(c).upper() for x in ['AWB', 'TRACKING']):
            awb_col = c
            break
            
    if not awb_col:
        print("❌ Could not identify AWB column")
        return

    print(f"📦 Found AWB Column: {awb_col}")
    
    # Ensure Columns Exist
    if status_col not in df.columns: df[status_col] = ''
    if location_col not in df.columns: df[location_col] = ''
    if update_col not in df.columns: df[update_col] = ''
        
    df[status_col] = df[status_col].astype(str)
    
    # Identify pending rows: Not Delivered/Exception/Unknown
    # Retrying 'Unknown' and 'Error'
    pending_mask = ~df[status_col].str.lower().isin(['delivered', 'exception', 'return to sender']) 
    
    pending_indices = df[pending_mask].index.tolist()
    total_pending = len(pending_indices)
    print(f"📋 {total_pending} shipments to track...")

    if total_pending == 0:
        print("✅ No pending shipments.")
        return

    # 3. Initialize Service
    service = FedExTrackingService(CLIENT_ID, CLIENT_SECRET, env=FEDEX_ENV)

    # 4. Batch Process
    BATCH_SIZE = 10 
    
    for i in range(0, total_pending, BATCH_SIZE):
        batch_indices = pending_indices[i : i + BATCH_SIZE]
        batch_awbs = [str(df.at[idx, awb_col]).replace(' ', '').strip() for idx in batch_indices]
        
        print(f"🔄 Processing batch {i//BATCH_SIZE + 1} ({len(batch_awbs)} items)...")
        
        results = service.track_batch(batch_awbs, max_workers=5)
        
        # Update DataFrame
        for res in results:
            awb = res['awb']
            status = res['status']
            loc = res.get('current_location', '')
            last_date = res.get('last_update', '')
            
            # Find index for this AWB
            original_idx = -1
            for idx in batch_indices:
                val = str(df.at[idx, awb_col]).replace(' ', '').strip()
                if val == awb:
                    original_idx = idx
                    break
            
            if original_idx != -1:
                df.at[original_idx, status_col] = status
                df.at[original_idx, location_col] = loc
                df.at[original_idx, update_col] = last_date
                
                print(f"   ✓ {awb}: {status} | {loc}")
        
        # Save every batch
        try:
            df.to_excel(file_path, index=False)
            print("💾 Saved progress.")
        except Exception as e:
            print(f"⚠️ Save Error: {e}")
            
        # Rate limit safety
        time.sleep(1)

    print("✅ Tracking Run Complete.")

if __name__ == "__main__":
    target_file = 'split_datasets/FEDEX(564).xlsx'
    process_excel_tracking(target_file)
