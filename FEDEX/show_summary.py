import pandas as pd
import os

print("\n📊 Dataset Split Summary:")
print("=" * 70)

files = sorted([f for f in os.listdir('split_datasets') if f.endswith('.xlsx')])
total_rows = 0

for filename in files:
    filepath = os.path.join('split_datasets', filename)
    df = pd.read_excel(filepath)
    count = len(df)
    total_rows += count
    
    # Extract service name from filename
    service_name = filename.replace('.xlsx', '').replace('_', ' ')
    print(f"{service_name:<35} {count:>6} rows")

print("=" * 70)
print(f"{'TOTAL':<35} {total_rows:>6} rows")
print("\n✅ All files are located in the 'split_datasets' folder")
