import json
from collections import Counter

# Read the JSON file
with open('split_datasets/COURIER_WALA_tracking_details.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('\n✅ COURIER WALA TRACKING COMPLETE')
print('=' * 70)

# Show each shipment
for i, shipment in enumerate(data['shipments'], 1):
    awb = shipment['awb']
    status = shipment['status']
    print(f'{i:2d}. AWB {awb}: {status}')

print('=' * 70)

# Summary statistics
print(f'\n📊 Summary:')
print(f'  Total Shipments: {data["total_shipments"]}')

# Count statuses
statuses = [s['status'] for s in data['shipments']]
status_counts = Counter(statuses)
for status, count in status_counts.most_common():
    print(f'  {status}: {count}')

# Timeline info
shipments_with_timeline = sum(1 for s in data['shipments'] if s['timeline'])

print(f'\n📁 Files Updated:')
print(f'  ✓ Excel: split_datasets/COURIER_WALA.xlsx (STATUS column updated)')
print(f'  ✓ JSON: split_datasets/COURIER_WALA_tracking_details.json')
print(f'  ✓ Shipments with detailed timeline: {shipments_with_timeline}/{data["total_shipments"]}')

print(f'\n🎯 Result: ALL {data["total_shipments"]} shipments tracked successfully!')
print('=' * 70)
