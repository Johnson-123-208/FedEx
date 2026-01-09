#!/usr/bin/env python3
"""
Quick test of batch tracker with FedEx API
Processes first 5 rows to verify everything works
"""

import pandas as pd
from dotenv import load_dotenv

load_dotenv()

print("="* 60)
print("BATCH TRACKER TEST - First 5 Rows")
print("=" * 60)

# Check FedEx API availability
try:
    from fedex_api import track_shipment
    print("\n✓ FedEx REST API available")
    
    # Quick API test
    result = track_shipment("794887278605")
    if result['success']:
        print(f"✓ API test successful: {result['status']}")
    else:
        print(f"⚠️ API test failed: {result.get('error')}")
except ImportError:
    print("\n⚠️ FedEx REST API not available")

# Check dataset
df = pd.read_excel('DataSet.xlsx')
print(f"\n📊 Total rows in dataset: {len(df)}")

# Find columns
awb_col = next((col for col in df.columns if 'AWB' in col.upper()), None)
provider_col = next((col for col in df.columns if 'SERVICE' in col.upper() or 'PROVIDER' in col.upper()), None)

print(f"📋 AWB Column: {awb_col}")
print(f"📋Service Column: {provider_col}")

# Show first 5 rows
print(f"\n🔍 First 5 shipments:")
for idx in range(min(5, len(df))):
    row = df.iloc[idx]
    awb = row[awb_col]
    provider = row[provider_col]
    status = row.get('STATUS', '')
    print(f"   {idx+1}. {provider}: {awb} {'[' + status + ']' if status else ''}")

# Count by provider
provider_counts = df[provider_col].value_counts()
print(f"\n📊 Provider distribution:")
for provider, count in provider_counts.items():
    print(f"   {provider}: {count} shipments")

print(f"\n💡 To run full batch update:")
print(f"   python3 batch_tracker_optimized.py")
print(f"\n💡 FedEx shipments will use REST API (fast & reliable)")
print(f"   Other providers will use Selenium (slower but working)")
print()
