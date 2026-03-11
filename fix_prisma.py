import os
import re

directories_to_scan = ['d:\\NextJs\\dutaassets\\action', 'd:\\NextJs\\dutaassets\\app\\(main)']

def fix_prisma_queries():
    for root_dir in directories_to_scan:
        for root, dirs, files in os.walk(root_dir):
            for f in files:
                if f.endswith(('.ts', '.tsx')):
                    path = os.path.join(root, f)
                    with open(path, 'r', encoding='utf-8') as file:
                        content = file.read()

                    original_content = content
                    
                    # Fix missing optional chaining regex missed
                    content = re.sub(r'\basset\?\.nama_asset\b', 'asset?.item?.name', content)
                    content = re.sub(r'\basset\?\.kode_asset\b', 'asset?.item?.code', content)
                    content = re.sub(r'\bdata\?\.nama_asset\b', 'data?.item?.name', content)
                    
                    # Replace `asset: true` with `asset: { include: { item: true } }`
                    # Only do this if we are not already nested, but `asset: true` usually means include
                    content = re.sub(r'\basset:\s*true\b', 'asset: { include: { item: { include: { category: true } } } }', content)
                    
                    # Fix asset query select
                    content = content.replace('nama_asset: true, kode_asset: true', 'item: { select: { name: true, code: true } }')
                    
                    # Fix item query select categories
                    content = content.replace('itemCategory: true', 'category: true')

                    if content != original_content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(content)

if __name__ == '__main__':
    fix_prisma_queries()
