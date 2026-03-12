import os
import re

directories_to_scan = ['d:\\NextJs\\dutaassets\\action', 'd:\\NextJs\\dutaassets\\app\\(main)', 'd:\\NextJs\\dutaassets\\schema']

def file_replacements():
    for root_dir in directories_to_scan:
        if not os.path.exists(root_dir): continue
        for root, dirs, files in os.walk(root_dir):
            for f in files:
                if f.endswith(('.ts', '.tsx')):
                    path = os.path.join(root, f)
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()

                    original_content = content
                    
                    # Fix deep item associations
                    content = content.replace('itemCategory?', 'category?')
                    content = content.replace('itemCategory.', 'category.')
                    content = content.replace('itemCategory:', 'category:')
                    
                    content = content.replace('asset.categoryId', 'asset.itemId')
                    
                    # specific fixes
                    if 'asset-action-dialog.tsx' in f:
                        content = content.replace('kode_asset:', 'itemId:')
                        content = content.replace('nama_asset:', 'itemId:')
                        content = content.replace('categoryId:', 'itemId:')

                    if 'inspection-columns.tsx' in f or 'inspection-table.tsx' in f:
                        content = content.replace('"kode_asset" | "nama_asset"', '"itemId"')

                    if 'fixed-asset-form-fields.tsx' in f:
                        content = content.replace('"kode_asset"', '"itemId"')
                        content = content.replace('"nama_asset"', '"itemId"')
                        content = content.replace('"categoryId"', '"itemId"')
                        content = content.replace('"harga"', '"itemId"')
                        content = content.replace('"vendor"', '"itemId"')
                        content = content.replace('"brand" | "model" | "serial_number"', '"serial_number"')
                        content = content.replace('"model" | "serial_number" | "brand"', '"serial_number"')
                        
                    if 'supply-asset-form-fields.tsx' in f:
                        content = content.replace('"categoryId"', '"category"')
                        
                    if 'notification-action.ts' in f or 'disposals/page.tsx' in f:
                        content = content.replace('asset?', 'assetId?')
                        content = content.replace('asset.id', 'assetId')

                    if content != original_content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(content)

if __name__ == '__main__':
    file_replacements()
