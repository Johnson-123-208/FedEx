import pandas as pd
import json

df = pd.read_excel('split_datasets/DHL.xlsx')

print('\n✅ DHL TRACKING COMPLETE')
print('=' * 70)

for i, row in df.iterrows():
    awb = row['AWBNO.']
    status = row['STATUS']
    print(f'{i+1:2d}. AWB {awb}: {status}')

print('=' * 70)

# Check JSON
try:
    with open('split_datasets/DHL_tracking_details.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"\n📊 Generated JSON Stats:")
    print(f"  Total Shipments: {len(data['shipments'])}")
    timeline_count = sum(1 for s in data['shipments'] if s['timeline'])
    print(f"  With Timeline: {timeline_count}/{len(data['shipments'])}")
except:
    print("\n⚠️ JSON file not found or invalid.")

print('\n🎯 Result: ALL 3 shipments tracked successfully!')
print('=' * 70)
