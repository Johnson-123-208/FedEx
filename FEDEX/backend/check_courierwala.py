import pandas as pd

df = pd.read_excel('split_datasets/COURIER_WALA.xlsx')

print('\n✅ COURIER WALA Excel File Check')
print('=' * 70)
print(f'Total rows: {len(df)}')
print(f'Has STATUS column: {"STATUS" in df.columns}')

if 'STATUS' in df.columns:
    print('\nAWB Numbers and Status:')
    for i, row in df.iterrows():
        awb = row['AWBNO.']
        status = row.get('STATUS', 'N/A')
        print(f'{i+1:2d}. AWB {int(awb)}: {status}')
    
    print('\n' + '=' * 70)
    print('\nStatus Summary:')
    print(df['STATUS'].value_counts())
else:
    print('\n❌ STATUS column not found - file may not have been updated')

print('=' * 70)
