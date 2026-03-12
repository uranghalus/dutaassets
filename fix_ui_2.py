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

                    # Fix Missing Includes in queries:
                    # `include: { asset: true }` -> `include: { asset: { include: { item: true } } }`
                    # Only if it's missing 'item:'
                    original_content = content
                    content = content.replace('asset: true', 'asset: { include: { item: true } }')
                    content = content.replace('CategoryCountOutputTypeSelect', '{ items?: boolean, assetTransfers?: boolean }')
                    
                    
                    # Fix asset validation schema
                    if f == 'asset-schema.ts':
                         content = re.sub(r'nama_asset:\s*z\.string.*?,', '', content, flags=re.DOTALL)
                         content = re.sub(r'kode_asset:\s*z\.string.*?,', '', content, flags=re.DOTALL)
                         content = re.sub(r'categoryId:\s*z\.string.*?,', '', content, flags=re.DOTALL)
                         content = re.sub(r'brand:\s*z\.string.*?,', '', content, flags=re.DOTALL)
                         content = re.sub(r'model:\s*z\.string.*?,', '', content, flags=re.DOTALL)
                         content = re.sub(r'vendor:\s*z\.string.*?,', '', content, flags=re.DOTALL)
                         content = re.sub(r'harga:\s*z\.coerce\.number.*?,', '', content, flags=re.DOTALL)
                         if 'itemId' not in content:
                             content = content.replace('z.object({', 'z.object({\n  itemId: z.string().min(1, "Item is required"),\n')
                             
                    # Replace `item` type
                    content = content.replace('"kode_asset" | "nama_asset"', '"itemId"')
                    
                    # Action replaces
                    content = content.replace('itemCategory?', 'category?')
                    content = content.replace('categoryId: data.categoryId', 'itemId: data.itemId')
                    content = content.replace('categoryId: updateData.categoryId', 'itemId: updateData.itemId')
                    content = content.replace('nama_asset: true, kode_asset: true', 'item: { select: { name: true, code: true } }')
                    content = content.replace('categoryId: true, brand: true, model: true, deskripsi: true, vendor: true, harga: true', 'item: true')
                        
                    if content != original_content:
                        with open(path, 'w', encoding='utf-8') as file:
                            file.write(content)

if __name__ == '__main__':
    file_replacements()
