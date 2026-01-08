import pandas as pd
import os

# Analyze all dataset files
datasets_dir = 'split_datasets'

print("=" * 80)
print("DATASET STRUCTURE ANALYSIS")
print("=" * 80)

# List of tracking files to analyze (excluding United Express as per instructions)
tracking_files = [
    'ATLANTIC.xlsx',
    'COURIER_WALA.xlsx',
    'DHL.xlsx',
    'FEDEX(ICL).xlsx',
    'PXC_PACIFIC.xlsx'
]

for filename in tracking_files:
    filepath = os.path.join(datasets_dir, filename)
    if os.path.exists(filepath):
        print(f"\n{'='*80}")
        print(f"FILE: {filename}")
        print(f"{'='*80}")
        
        try:
            df = pd.read_excel(filepath)
            print(f"Total Rows: {len(df)}")
            print(f"\nColumn Names:")
            for i, col in enumerate(df.columns, 1):
                print(f"  {i}. {col}")
            
            print(f"\nSample Data (First Row):")
            if len(df) > 0:
                for col in df.columns:
                    val = df[col].iloc[0]
                    print(f"  {col}: {val}")
            
            print(f"\nData Types:")
            for col in df.columns:
                print(f"  {col}: {df[col].dtype}")
                
        except Exception as e:
            print(f"ERROR reading {filename}: {e}")
    else:
        print(f"\n{filename} - FILE NOT FOUND")

print("\n" + "=" * 80)
print("ANALYSIS COMPLETE")
print("=" * 80)
