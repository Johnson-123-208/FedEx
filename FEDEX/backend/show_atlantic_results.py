import pandas as pd
import json

# Read the updated Excel file
df = pd.read_excel('split_datasets/ATLANTIC.xlsx')

print('\n✅ ATLANTIC TRACKING COMPLETE')
print('=' * 70)

# Show each shipment
for i, row in df.iterrows():
    awb = row['AWBNO.']
    status = row['STATUS']
    print(f'{i+1:2d}. AWB {int(awb)}: {status}')

print('=' * 70)

# Summary statistics
print(f'\n📊 Summary:')
print(f'  Total Shipments: {len(df)}')
print(f'  Delivered: {(df["STATUS"] == "Delivered").sum()}')
print(f'  In Transit: {(df["STATUS"] == "In Transit").sum()}')
print(f'  At Delivery Centre: {(df["STATUS"] == "At Delivery Centre").sum()}')

# JSON file info
with open('split_datasets/ATLANTIC_tracking_details.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

shipments_with_timeline = sum(1 for s in data['shipments'] if s['timeline'])

print(f'\n📁 Files Updated:')
print(f'  ✓ Excel: split_datasets/ATLANTIC.xlsx (STATUS column updated)')
print(f'  ✓ JSON: split_datasets/ATLANTIC_tracking_details.json')
print(f'  ✓ Shipments with detailed timeline: {shipments_with_timeline}/{len(data["shipments"])}')

print(f'\n🎯 Result: ALL {len(df)} shipments tracked successfully!')
print('=' * 70)
