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
                    
                    # Fix asset validation schema
                    content = content.replace('categoryId:', 'itemId:')
                    content = content.replace('categoryId?', 'itemId?')
                    content = content.replace('categoryId ', 'itemId ')
                    content = content.replace('.categoryId', '.itemId')
                                        
                    # Component replaces
                    content = content.replace('asset.nama_asset', 'asset.item?.name')
                    content = content.replace('asset.kode_asset', 'asset.item?.code')
                    content = content.replace('asset.categoryId', 'asset.itemId')
                    
                    content = content.replace('data.nama_asset', 'data.item?.name')
                    content = content.replace('data.kode_asset', 'data.item?.code')

                    content = content.replace('row.original.nama_asset', 'row.original.item?.name')
                    content = content.replace('row.original.kode_asset', 'row.original.item?.code')
                    
                    # specific fixes
                    if 'asset-action-dialog.tsx' in f:
                        content = content.replace('asset.brand', 'asset.item?.brand')
                        content = content.replace('asset.model', 'asset.item?.model')
                        content = content.replace('asset.deskripsi', 'asset.item?.description')
                        content = content.replace('asset.vendor', 'asset.item?.vendorName')
                        content = content.replace('asset.harga', 'asset.item?.purchaseValue')
                    
                    if 'asset-columns.tsx' in f:
                        content = content.replace('asset.brand', 'asset.item?.brand')
                        content = content.replace('asset.model', 'asset.item?.model')

                    if content != original_content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(content)

if __name__ == '__main__':
    file_replacements()
