import pandas as pd
import os
import glob

def check_status():
    files = glob.glob('split_datasets/*.xlsx')
    
    print(f"{'FILE':<30} | {'TOTAL':<6} | {'COMPLETED':<9} | {'% DONE':<6}")
    print("-" * 65)
    
    total_rows = 0
    total_done = 0
    
    for f in files:
        filename = os.path.basename(f)
        try:
            df = pd.read_excel(f)
            count = len(df)
            
            if 'STATUS' in df.columns:
                # Count non-empty, non-Unknown statuses
                completed = df['STATUS'].astype(str).apply(lambda x: len(x) > 3 and x.lower() != 'unknown' and x.lower() != 'nan').sum()
            else:
                completed = 0
                
            pct = (completed / count * 100) if count > 0 else 0
            
            print(f"{filename:<30} | {count:<6} | {completed:<9} | {pct:.1f}%")
            
            total_rows += count
            total_done += completed
            
        except:
            print(f"{filename:<30} | ERROR READING FILE")

    print("-" * 65)
    total_pct = (total_done / total_rows * 100) if total_rows > 0 else 0
    print(f"{'TOTAL':<30} | {total_rows:<6} | {total_done:<9} | {total_pct:.1f}%")

if __name__ == "__main__":
    check_status()
