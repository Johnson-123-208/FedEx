"""
OFFLINE DATASET AUDIT SCRIPT
NO WEB SCRAPING - PURE CODE ANALYSIS
"""

import pandas as pd
import os
import sys

print("=" * 100)
print("TRACKING FILES vs DATASET AUDIT (OFFLINE - NO WEB ACCESS)")
print("=" * 100)

# Define tracking files and their corresponding datasets
tracking_configs = [
    {
        "name": "ATLANTIC",
        "tracking_file": "tracking_files/update_atlantic_tracking.py",
        "dataset_file": "split_datasets/ATLANTIC.xlsx"
    },
    {
        "name": "COURIER_WALA",
        "tracking_file": "tracking_files/update_courierwala_tracking.py",
        "dataset_file": "split_datasets/COURIER_WALA.xlsx"
    },
    {
        "name": "DHL",
        "tracking_file": "tracking_files/update_dhl_tracking.py",
        "dataset_file": "split_datasets/DHL.xlsx"
    },
    {
        "name": "FEDEX(ICL)",
        "tracking_file": "tracking_files/update_icl_tracking.py",
        "dataset_file": "split_datasets/FEDEX(ICL).xlsx"
    },
    {
        "name": "PXC_PACIFIC",
        "tracking_file": "tracking_files/update_pxc_tracking.py",
        "dataset_file": "split_datasets/PXC_PACIFIC.xlsx"
    }
]

issues_found = []

for config in tracking_configs:
    print(f"\n{'='*100}")
    print(f"AUDITING: {config['name']}")
    print(f"{'='*100}")
    
    # Load dataset
    try:
        df = pd.read_excel(config['dataset_file'])
        print(f"✓ Dataset loaded: {len(df)} rows")
        print(f"✓ Columns in dataset: {list(df.columns)}")
        
        # Read tracking file code
        with open(config['tracking_file'], 'r') as f:
            code = f.read()
        
        # Check for AWB column usage
        print(f"\n🔍 Checking AWB Column Logic...")
        
        # Check if code looks for AWB column
        if "'AWBNO.'" in code:
            if 'AWBNO.' in df.columns:
                print(f"  ✓ Code looks for 'AWBNO.' - FOUND in dataset")
            else:
                print(f"  ❌ Code looks for 'AWBNO.' - NOT FOUND in dataset")
                print(f"     Available columns: {list(df.columns)}")
                issues_found.append({
                    "file": config['name'],
                    "issue": "AWB column mismatch - code expects 'AWBNO.' but not in dataset",
                    "columns": list(df.columns)
                })
        
        if "awb_columns = [col for col in df.columns if 'AWB' in col.upper()]" in code:
            awb_cols = [col for col in df.columns if 'AWB' in col.upper()]
            if awb_cols:
                print(f"  ✓ Code searches for AWB columns - FOUND: {awb_cols}")
            else:
                print(f"  ❌ Code searches for AWB columns - NONE FOUND")
                print(f"     Available columns: {list(df.columns)}")
                issues_found.append({
                    "file": config['name'],
                    "issue": "No AWB column found in dataset",
                    "columns": list(df.columns)
                })
        
        # Check for hardcoded column index usage
        if "df.columns[2]" in code:
            if len(df.columns) > 2:
                print(f"  ⚠️  Code uses df.columns[2] as fallback - Column: '{df.columns[2]}'")
            else:
                print(f"  ❌ Code uses df.columns[2] but dataset only has {len(df.columns)} columns")
                issues_found.append({
                    "file": config['name'],
                    "issue": f"Code references df.columns[2] but dataset only has {len(df.columns)} columns",
                    "columns": list(df.columns)
                })
        
        # Check for STATUS column
        print(f"\n🔍 Checking STATUS Column...")
        if 'STATUS' in df.columns:
            print(f"  ✓ STATUS column exists in dataset")
        else:
            print(f"  ⚠️  STATUS column NOT in dataset (will be created by code)")
        
        # Check for null/empty values in AWB column
        print(f"\n🔍 Checking Data Quality...")
        awb_cols = [col for col in df.columns if 'AWB' in col.upper()]
        if awb_cols:
            awb_col = awb_cols[0]
            null_count = df[awb_col].isna().sum()
            empty_count = (df[awb_col] == '').sum() if df[awb_col].dtype == 'object' else 0
            print(f"  ✓ AWB column '{awb_col}': {len(df) - null_count - empty_count} valid values")
            if null_count > 0:
                print(f"    ⚠️  {null_count} null values")
            if empty_count > 0:
                print(f"    ⚠️  {empty_count} empty values")
        
        # Sample data
        print(f"\n📊 Sample Data (First Row):")
        if len(df) > 0:
            for col in df.columns:
                val = df[col].iloc[0]
                print(f"    {col}: {val}")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        issues_found.append({
            "file": config['name'],
            "issue": f"Failed to load or analyze: {str(e)}",
            "columns": []
        })

print(f"\n\n{'='*100}")
print("AUDIT SUMMARY")
print(f"{'='*100}")

if issues_found:
    print(f"\n❌ Found {len(issues_found)} issues:\n")
    for i, issue in enumerate(issues_found, 1):
        print(f"{i}. {issue['file']}")
        print(f"   Issue: {issue['issue']}")
        if issue['columns']:
            print(f"   Columns: {issue['columns']}")
        print()
else:
    print("\n✅ No critical issues found!")

print("\n" + "="*100)
print("NOTE: United Express was intentionally not analyzed as per instructions")
print("="*100)
