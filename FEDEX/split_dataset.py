import pandas as pd
import os

# Read the Excel file
df = pd.read_excel('DataSet.xlsx')

# Display basic information
print("Dataset Information:")
print(f"Total rows: {len(df)}")
print(f"\nColumns: {df.columns.tolist()}")
print(f"\nFirst 5 rows:")
print(df.head())

# Find the service provider column
service_columns = [col for col in df.columns if 'service' in col.lower() or 'courier' in col.lower() or 'provider' in col.lower()]
print(f"\n\nPossible service columns: {service_columns}")

if service_columns:
    service_col = service_columns[0]
    print(f"\nUsing column: '{service_col}'")
    print(f"\nService Provider Distribution:")
    print(df[service_col].value_counts())
    
    # Create output directory
    output_dir = 'split_datasets'
    os.makedirs(output_dir, exist_ok=True)
    
    # Split dataset by service provider
    unique_services = df[service_col].unique()
    print(f"\n\nSplitting dataset into {len(unique_services)} files...")
    
    for service in unique_services:
        if pd.notna(service):  # Skip NaN values
            # Filter data for this service
            service_df = df[df[service_col] == service]
            
            # Create filename (sanitize service name)
            filename = f"{service.replace(' ', '_').replace('/', '_')}.xlsx"
            filepath = os.path.join(output_dir, filename)
            
            # Save to Excel
            service_df.to_excel(filepath, index=False)
            print(f"✓ Created {filename} with {len(service_df)} rows")
    
    print(f"\n✅ All files created in '{output_dir}' folder!")
else:
    print("\n❌ Could not find service provider column. Please check column names.")
    print(f"Available columns: {df.columns.tolist()}")
