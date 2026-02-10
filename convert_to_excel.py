#!/usr/bin/env python3
"""
Convert TEST_CASES.md to Excel format
"""

import pandas as pd
import re
from pathlib import Path

def parse_markdown_tables(md_file):
    """Parse markdown tables from the file"""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all markdown tables
    # Tables are delimited by triple pipes and contain headers
    tables = []
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Look for table header (contains |---|---|...)
        if i + 1 < len(lines) and '|---|' in lines[i + 1]:
            # Found a table header, parse it
            header_line = lines[i]
            if header_line.startswith('|') and header_line.endswith('|'):
                # Extract headers
                headers = [h.strip() for h in header_line.split('|')[1:-1]]
                
                # Skip separator line
                i += 2
                
                # Collect rows
                rows = []
                while i < len(lines):
                    row_line = lines[i].strip()
                    if not row_line.startswith('|') or '---' in row_line:
                        break
                    
                    # Extract row data
                    row_data = [cell.strip() for cell in row_line.split('|')[1:-1]]
                    
                    # Only add if we have data
                    if row_data and len(row_data) > 0:
                        # Ensure row has same number of columns as headers
                        while len(row_data) < len(headers):
                            row_data.append('')
                        rows.append(row_data[:len(headers)])
                    
                    i += 1
                
                if rows:
                    tables.append({
                        'headers': headers,
                        'rows': rows
                    })
                continue
        
        i += 1
    
    return tables

def extract_section_title(md_file):
    """Extract section titles from markdown"""
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    sections = []
    for i, line in enumerate(lines):
        if line.startswith('## ') and not line.startswith('## Template'):
            # Extract the section number and title
            section_text = line.replace('## ', '').strip()
            # Find the next table
            for j in range(i, min(i + 20, len(lines))):
                if '|' in lines[j] and 'Test Case ID' in lines[j]:
                    sections.append({
                        'title': section_text,
                        'line': i
                    })
                    break
    
    return sections

def main():
    md_file = Path('docs/test-cases/TEST_CASES.md')
    excel_file = Path('docs/test-cases/TEST_CASES.xlsx')
    
    if not md_file.exists():
        print(f"Error: {md_file} not found")
        return
    
    print(f"Reading {md_file}...")
    tables = parse_markdown_tables(str(md_file))
    
    if not tables:
        print("No tables found in markdown file")
        return
    
    print(f"Found {len(tables)} tables")
    
    # Create Excel writer
    with pd.ExcelWriter(str(excel_file), engine='openpyxl') as writer:
        for idx, table in enumerate(tables):
            # Create DataFrame
            df = pd.DataFrame(table['rows'], columns=table['headers'])
            
            # Sheet name based on table number
            sheet_name = f"Tests_{idx + 1}"
            if idx == 0:
                sheet_name = "All_Tests"
            
            print(f"Writing sheet: {sheet_name} ({len(df)} rows)")
            
            # Write to Excel
            df.to_excel(writer, sheet_name=sheet_name, index=False)
            
            # Auto-adjust column widths
            worksheet = writer.sheets[sheet_name]
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = (max_length + 2)
                worksheet.column_dimensions[column_letter].width = min(adjusted_width, 50)
    
    print(f"✓ Excel file created: {excel_file}")
    
    # Print summary
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
        if 'Total Tests:' in content:
            for line in content.split('\n'):
                if 'Total Tests:' in line or 'Passing Tests:' in line or 'Failing Tests:' in line:
                    print(f"  {line.strip()}")

if __name__ == '__main__':
    main()
