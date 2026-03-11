import os
import re

directories_to_scan = ['d:\\NextJs\\dutaassets\\app\\(main)', 'd:\\NextJs\\dutaassets\\action', 'd:\\NextJs\\dutaassets\\schema', 'd:\\NextJs\\dutaassets\\components']

def file_replacements():
    for root_dir in directories_to_scan:
        if not os.path.exists(root_dir): continue
        for root, dirs, files in os.walk(root_dir):
            for f in files:
                if f.endswith(('.ts', '.tsx')):
                    path = os.path.join(root, f)
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()

                    replacements = {
                        r'\basset\.nama_asset\b': 'asset.item?.name',
                        r'\basset\.kode_asset\b': 'asset.item?.code',
                        r'\basset\.assetCategory\b': 'asset.item?.category',
                        r'\basset\.brand\b': 'asset.item?.brand',
                        r'\basset\.model\b': 'asset.item?.model',
                        r'\basset\.harga\b': 'asset.item?.purchaseValue',
                        r'\basset\.deskripsi\b': 'asset.item?.description',
                        r'\basset\.purchaseValue\b': 'asset.item?.purchaseValue',
                        r'\basset\.vendor\b': 'asset.item?.vendorName',

                        r'\bdata\.nama_asset\b': 'data.item?.name',
                        r'\bdata\.kode_asset\b': 'data.item?.code',

                        r'\brow\.original\.nama_asset\b': 'row.original.item?.name',
                        r'\brow\.original\.kode_asset\b': 'row.original.item?.code',
                        
                        r'\bItemCategory\b': 'Category',
                        r'\bAssetCategory\b': 'Category',
                    }
                    
                    original_content = content
                    for old, new in replacements.items():
                        content = re.sub(old, new, content)
                        
                    if content != original_content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(content)

if __name__ == '__main__':
    file_replacements()
