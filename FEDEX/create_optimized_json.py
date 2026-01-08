import pandas as pd
import json
from datetime import datetime

def create_optimized_json():
    """
    Create an optimized JSON with only essential fields
    """
    try:
        # Read all sheets
        excel_file = pd.ExcelFile('DataSet.xlsx')
        print(f"📊 Processing {len(excel_file.sheet_names)} sheets...")
        
        all_shipments = []
        
        for sheet_name in excel_file.sheet_names:
            df = pd.read_excel('DataSet.xlsx', sheet_name=sheet_name)
            
            # Only keep essential columns
            essential_cols = ['AWBNO.', 'Date', 'Sender', 'Destination', 'weight(Kg)', 'STATUS']
            
            for _, row in df.iterrows():
                shipment = {
                    'awb': str(row.get('AWBNO.', 'N/A')),
                    'date': str(row.get('Date', '2025-01-11'))[:10],  # Only date part
                    'sender': str(row.get('Sender', 'N/A'))[:50],  # Limit length
                    'destination': str(row.get('Destination', 'N/A'))[:30],
                    'weight': str(row.get('weight(Kg)', '0')),
                    'status': str(row.get('STATUS', 'Unknown'))
                }
                all_shipments.append(shipment)
        
        # Calculate metrics
        total = len(all_shipments)
        delivered = sum(1 for s in all_shipments if 'deliver' in s['status'].lower())
        in_transit = sum(1 for s in all_shipments if 'transit' in s['status'].lower())
        success_rate = round((delivered / total * 100), 1) if total > 0 else 0
        
        output = {
            'generated_at': datetime.now().isoformat(),
            'metrics': {
                'total': total,
                'delivered': delivered,
                'in_transit': in_transit,
                'success_rate': success_rate
            },
            'shipments': all_shipments
        }
        
        # Save to public folder
        output_file = 'public/data/shipments_data.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2)
        
        print(f"\n✅ Created optimized JSON: {output_file}")
        print(f"📦 Total: {total} | ✓ Delivered: {delivered} | 🚚 In Transit: {in_transit}")
        print(f"📊 Success Rate: {success_rate}%")
        
        # Also create a backup in src/data
        with open('src/data/shipments_data.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2)
        
        return output_file
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("🚀 Creating optimized JSON...\n")
    create_optimized_json()
