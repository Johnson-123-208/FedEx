"""
COMPREHENSIVE OFFLINE AUDIT & FIX GENERATOR
NO WEB SCRAPING - PURE CODE & DATA ANALYSIS
"""

import os
import re

print("=" * 100)
print("OFFLINE TRACKING FILES AUDIT - NO WEB ACCESS")
print("=" * 100)

# Analysis results
audit_results = []

# Define tracking files to audit (excluding United Express as per instructions)
tracking_files = [
    {
        "name": "ATLANTIC",
        "file": "tracking_files/update_atlantic_tracking.py",
        "dataset": "split_datasets/ATLANTIC.xlsx"
    },
    {
        "name": "COURIER_WALA",
        "file": "tracking_files/update_courierwala_tracking.py",
        "dataset": "split_datasets/COURIER_WALA.xlsx"
    },
    {
        "name": "DHL",
        "file": "tracking_files/update_dhl_tracking.py",
        "dataset": "split_datasets/DHL.xlsx"
    },
    {
        "name": "FEDEX(ICL)",
        "file": "tracking_files/update_icl_tracking.py",
        "dataset": "split_datasets/FEDEX(ICL).xlsx"
    },
    {
        "name": "PXC_PACIFIC",
        "file": "tracking_files/update_pxc_tracking.py",
        "dataset": "split_datasets/PXC_PACIFIC.xlsx"
    },
    {
        "name": "FEDEX",
        "file": "tracking_files/update_fedex_tracking.py",
        "dataset": "split_datasets/FEDEX(564).xlsx"  # Assuming this is the FedEx dataset
    }
]

print("\n🔍 ANALYZING TRACKING FILES...\n")

for config in tracking_files:
    print(f"{'='*100}")
    print(f"FILE: {config['name']}")
    print(f"{'='*100}\n")
    
    result = {
        "name": config['name'],
        "file": config['file'],
        "issues": [],
        "fixes": []
    }
    
    # Read tracking file
    try:
        with open(config['file'], 'r') as f:
            code = f.read()
        
        # Check 1: AWB Column Logic
        print("📌 Checking AWB Column Logic...")
        
        # Check if it uses hardcoded 'AWBNO.'
        if "'AWBNO.'" in code or '"AWBNO."' in code:
            print("  ⚠️  Uses hardcoded 'AWBNO.' column name")
            result['issues'].append("Hardcoded 'AWBNO.' column - may not exist in all datasets")
            result['fixes'].append("Use flexible AWB column detection")
        
        # Check if it uses df.columns[2] as fallback
        if "df.columns[2]" in code:
            print("  ⚠️  Uses df.columns[2] as fallback - risky if dataset structure changes")
            result['issues'].append("Uses hardcoded column index df.columns[2]")
            result['fixes'].append("Use safer AWB column detection with proper error handling")
        
        # Check if it searches for AWB columns dynamically
        if "awb_columns = [col for col in df.columns if 'AWB' in col.upper()]" in code:
            print("  ✓ Uses dynamic AWB column search")
        else:
            print("  ❌ Does NOT use dynamic AWB column search")
            result['issues'].append("Missing dynamic AWB column detection")
            result['fixes'].append("Add: awb_columns = [col for col in df.columns if 'AWB' in col.upper()]")
        
        # Check 2: File Path
        print("\n📌 Checking File Path...")
        
        # Extract file path from code
        file_path_match = re.search(r"file_path\s*=\s*['\"]([^'\"]+)['\"]", code)
        if file_path_match:
            file_path = file_path_match.group(1)
            print(f"  File path in code: {file_path}")
            
            # Check if it matches expected dataset
            if config['dataset'] not in file_path:
                print(f"  ⚠️  File path mismatch!")
                print(f"     Expected: {config['dataset']}")
                print(f"     Found: {file_path}")
                result['issues'].append(f"File path mismatch - uses '{file_path}' instead of '{config['dataset']}'")
                result['fixes'].append(f"Update file_path to '{config['dataset']}'")
        
        # Check 3: Null/Empty Value Handling
        print("\n📌 Checking Null/Empty Value Handling...")
        
        if "pd.notna(awb" in code or "pd.isna(awb" in code:
            print("  ✓ Has null value checking")
        else:
            print("  ⚠️  Missing explicit null value checking")
            result['issues'].append("Missing pd.notna() check for AWB values")
            result['fixes'].append("Add: if pd.notna(awb_number) before processing")
        
        # Check 4: Error Handling
        print("\n📌 Checking Error Handling...")
        
        if "try:" in code and "except" in code:
            print("  ✓ Has try/except blocks")
        else:
            print("  ❌ Missing error handling")
            result['issues'].append("Missing try/except error handling")
            result['fixes'].append("Add try/except blocks around tracking logic")
        
        # Check 5: Return Structure
        print("\n📌 Checking Return Structure...")
        
        # Check if function returns proper dict structure
        if '"awb":' in code or "'awb':" in code:
            print("  ✓ Returns AWB in result")
        
        if '"status":' in code or "'status':" in code:
            print("  ✓ Returns status in result")
        
        if '"timeline":' in code or "'timeline':" in code:
            print("  ✓ Returns timeline in result")
        
        # Check 6: Column Creation
        print("\n📌 Checking STATUS Column Creation...")
        
        if "if 'STATUS' not in df.columns:" in code:
            print("  ✓ Creates STATUS column if missing")
        else:
            print("  ⚠️  Doesn't explicitly create STATUS column")
            result['issues'].append("Missing STATUS column creation check")
            result['fixes'].append("Add: if 'STATUS' not in df.columns: df['STATUS'] = ''")
        
        audit_results.append(result)
        
    except FileNotFoundError:
        print(f"  ❌ File not found: {config['file']}")
        result['issues'].append(f"File not found: {config['file']}")
        audit_results.append(result)
    except Exception as e:
        print(f"  ❌ Error reading file: {e}")
        result['issues'].append(f"Error reading file: {e}")
        audit_results.append(result)
    
    print()

# Generate Summary Report
print("\n" + "=" * 100)
print("AUDIT SUMMARY REPORT")
print("=" * 100 + "\n")

total_issues = sum(len(r['issues']) for r in audit_results)

if total_issues == 0:
    print("✅ NO ISSUES FOUND - All tracking files appear correct!\n")
else:
    print(f"❌ FOUND {total_issues} TOTAL ISSUES\n")
    
    for result in audit_results:
        if result['issues']:
            print(f"\n📁 {result['name']}")
            print(f"   File: {result['file']}")
            print(f"   Issues Found: {len(result['issues'])}")
            for i, issue in enumerate(result['issues'], 1):
                print(f"      {i}. {issue}")
            print(f"   Recommended Fixes:")
            for i, fix in enumerate(result['fixes'], 1):
                print(f"      {i}. {fix}")

print("\n" + "=" * 100)
print("IMPORTANT NOTE:")
print("United Express was intentionally not modified as per instructions.")
print("=" * 100)
