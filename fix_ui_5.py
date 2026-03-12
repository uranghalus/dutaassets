import os
import re

directories_to_scan = ['d:\\NextJs\\dutaassets\\action', 'd:\\NextJs\\dutaassets\\app\\(main)']

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
                    
                    # Fix deep item associations in Prisma generated types or select clauses
                    content = content.replace('select: { kode_asset: { include: { item: true } } }', 'select: { item: { select: { code: true } } }')
                    content = content.replace('nama_asset: { include: { item: true } }', 'item: { select: { name: true } }')
                    
                    # Search action specific
                    content = content.replace('kode_asset: { contains: query }', 'item: { code: { contains: query } }')
                    content = content.replace('nama_asset: { contains: query }', 'item: { name: { contains: query } }')
                    
                    # Notifications / Disposals asset missing ID
                    content = content.replace('asset.assetId', 'asset?.itemId')
                    
                    if content != original_content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(content)

if __name__ == '__main__':
    file_replacements()
