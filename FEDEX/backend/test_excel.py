import pandas as pd
import json

try:
    # Read Excel file
    df = pd.read_excel('DataSet.xlsx')
    
    print("✅ Excel file loaded successfully!")
    print(f"📊 Total rows: {len(df)}")
    print(f"📋 Columns: {df.columns.tolist()}")
    print(f"\n📄 First 3 rows:")
    print(df.head(3))
    
    # Test the transformation
    shipments = df.to_dict('records')
    print(f"\n✅ Converted to {len(shipments)} shipment records")
    print(f"\n📦 Sample shipment:")
    print(json.dumps(shipments[0], indent=2, default=str))
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
