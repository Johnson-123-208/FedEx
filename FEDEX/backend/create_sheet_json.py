import pandas as pd
import json
from datetime import datetime
import os

def create_sheet_wise_json():
    """
    Create separate JSON files for each sheet in the Excel file
    """
    try:
        # Read all sheets
        excel_file = pd.ExcelFile('DataSet.xlsx')
        print(f"📊 Processing {len(excel_file.sheet_names)} sheets...\n")
        
        # Create output directory
        os.makedirs('public/data/sheets', exist_ok=True)
        
        all_metrics = {
            'total': 0,
            'delivered': 0,
            'in_transit': 0,
            'success_rate': 0
        }
        
        sheet_files = []
        
        for sheet_name in excel_file.sheet_names:
            print(f"📄 Processing: {sheet_name}")
            df = pd.read_excel('DataSet.xlsx', sheet_name=sheet_name)
            
            shipments = []
            for _, row in df.iterrows():
                shipment = {
                    'awb': str(row.get('AWBNO.', 'N/A')),
                    'date': str(row.get('Date', '2025-01-11'))[:10],
                    'sender': str(row.get('Sender', 'N/A'))[:50],
                    'destination': str(row.get('Destination', 'N/A'))[:30],
                    'weight': str(row.get('weight(Kg)', '0')),
                    'status': str(row.get('STATUS', 'Unknown')),
                    'service': str(row.get('Service', 'N/A'))
                }
                shipments.append(shipment)
            
            # Calculate metrics for this sheet
            sheet_total = len(shipments)
            sheet_delivered = sum(1 for s in shipments if 'deliver' in s['status'].lower())
            sheet_in_transit = sum(1 for s in shipments if 'transit' in s['status'].lower())
            
            # Update overall metrics
            all_metrics['total'] += sheet_total
            all_metrics['delivered'] += sheet_delivered
            all_metrics['in_transit'] += sheet_in_transit
            
            # Create sheet data
            sheet_data = {
                'sheet_name': sheet_name,
                'count': sheet_total,
                'shipments': shipments
            }
            
            # Save to file (sanitize filename)
            safe_filename = sheet_name.replace(' ', '_').replace('/', '-')
            output_file = f'public/data/sheets/{safe_filename}.json'
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(sheet_data, f, indent=2)
            
            sheet_files.append({
                'name': sheet_name,
                'file': f'sheets/{safe_filename}.json',
                'count': sheet_total
            })
            
            print(f"   ✓ Saved {sheet_total} records to {safe_filename}.json")
        
        # Calculate overall success rate
        all_metrics['success_rate'] = round(
            (all_metrics['delivered'] / all_metrics['total'] * 100), 1
        ) if all_metrics['total'] > 0 else 0
        
        # Create index file with metadata
        index_data = {
            'generated_at': datetime.now().isoformat(),
            'total_sheets': len(excel_file.sheet_names),
            'metrics': all_metrics,
            'sheets': sheet_files
        }
        
        with open('public/data/sheets_index.json', 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2)
        
        print(f"\n✅ Created {len(sheet_files)} sheet files")
        print(f"📦 Total Shipments: {all_metrics['total']}")
        print(f"✓ Delivered: {all_metrics['delivered']}")
        print(f"🚚 In Transit: {all_metrics['in_transit']}")
        print(f"📊 Success Rate: {all_metrics['success_rate']}%")
        print(f"\n📋 Index file: public/data/sheets_index.json")
        
        return index_data
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("🚀 Creating sheet-wise JSON files...\n")
    create_sheet_wise_json()
