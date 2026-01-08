import pandas as pd
import json

# Simple test - just create index with metrics
try:
    print("Reading Excel file...")
    xl = pd.ExcelFile('DataSet.xlsx')
    
    print(f"Found {len(xl.sheet_names)} sheets")
    
    # Just read first sheet as test
    df = pd.read_excel('DataSet.xlsx', sheet_name=xl.sheet_names[0])
    print(f"First sheet has {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")
    
    # Create simple index
    index = {
        "metrics": {
            "total": 100,
            "delivered": 50,
            "in_transit": 10,
            "success_rate": 50.0
        },
        "sheets": [
            {"name": "Test", "file": "sheets/test.json", "count": 100}
        ]
    }
    
    with open('public/data/sheets_index.json', 'w') as f:
        json.dump(index, f, indent=2)
    
    print("✅ Created test index file")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
