import pandas as pd
import json
from datetime import datetime

def extract_excel_to_json():
    """
    Extract all sheets from DataSet.xlsx and save to shipments_data.json
    """
    try:
        # Read all sheets from Excel
        excel_file = pd.ExcelFile('DataSet.xlsx')
        print(f"📊 Found {len(excel_file.sheet_names)} sheets: {excel_file.sheet_names}")
        
        all_shipments = []
        
        # Process each sheet
        for sheet_name in excel_file.sheet_names:
            print(f"\n📄 Processing sheet: {sheet_name}")
            df = pd.read_excel('DataSet.xlsx', sheet_name=sheet_name)
            
            print(f"   Rows: {len(df)}")
            print(f"   Columns: {df.columns.tolist()}")
            
            # Convert to records
            records = df.to_dict('records')
            
            # Add sheet name to each record
            for record in records:
                record['_sheet'] = sheet_name
                # Convert any NaN to None for JSON compatibility
                for key, value in record.items():
                    if pd.isna(value):
                        record[key] = None
            
            all_shipments.extend(records)
            print(f"   ✓ Added {len(records)} records")
        
        # Calculate metrics
        total = len(all_shipments)
        
        # Try to find STATUS column (case-insensitive)
        status_key = None
        if all_shipments:
            for key in all_shipments[0].keys():
                if 'status' in str(key).lower():
                    status_key = key
                    break
        
        delivered = 0
        in_transit = 0
        
        if status_key:
            for record in all_shipments:
                status = str(record.get(status_key, '')).lower()
                if 'deliver' in status:
                    delivered += 1
                elif 'transit' in status:
                    in_transit += 1
        
        success_rate = round((delivered / total * 100), 1) if total > 0 else 0
        
        # Create final JSON structure
        output = {
            'generated_at': datetime.now().isoformat(),
            'total_sheets': len(excel_file.sheet_names),
            'sheet_names': excel_file.sheet_names,
            'metrics': {
                'total': total,
                'delivered': delivered,
                'in_transit': in_transit,
                'success_rate': success_rate
            },
            'shipments': all_shipments
        }
        
        # Save to JSON file
        output_file = 'src/data/shipments_data.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, default=str)
        
        print(f"\n✅ Successfully created {output_file}")
        print(f"📦 Total shipments: {total}")
        print(f"✓ Delivered: {delivered}")
        print(f"🚚 In Transit: {in_transit}")
        print(f"📊 Success Rate: {success_rate}%")
        
        return output_file
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("🚀 Extracting Excel data to JSON...\n")
    result = extract_excel_to_json()
    if result:
        print(f"\n✨ Done! Website can now read from: {result}")
