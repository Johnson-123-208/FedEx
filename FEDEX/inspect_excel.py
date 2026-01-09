import pandas as pd
import sys

try:
    df = pd.read_excel('backend/DataSet.xlsx')
    print("=== COLUMN NAMES ===")
    for i, col in enumerate(df.columns):
        print(f"{i}: {col}")
    
    print("\n=== FIRST 5 ROWS ===")
    print(df.head().to_string())
    
    # Try to find provider column
    provider_candidates = [col for col in df.columns if 'SERVICE' in str(col).upper() or 'PROVIDER' in str(col).upper() or 'COURIER' in str(col).upper()]
    
    if provider_candidates:
        print(f"\n=== PROVIDER COLUMN: {provider_candidates[0]} ===")
        print("Unique values:")
        print(df[provider_candidates[0]].value_counts())
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
