import pandas as pd
import sys
import os

print("Starting inspection...", flush=True)
try:
    path = 'backend/DataSet.xlsx'
    if not os.path.exists(path):
        print(f"File not found at {path}", flush=True)
        sys.exit(1)
        
    df = pd.read_excel(path)
    print(f"Columns: {list(df.columns)}", flush=True)
    
    if 'Service Provider' in df.columns:
        print(f"Providers: {list(df['Service Provider'].unique())}", flush=True)
    else:
        print("Column 'Service Provider' not found", flush=True)
        
except Exception as e:
    print(f"Error: {e}", flush=True)
