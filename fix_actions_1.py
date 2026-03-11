import os
import re

actions_dir = 'd:\\NextJs\\dutaassets\\action'

def replace_in_action_files():
    for f in os.listdir(actions_dir):
        if not f.endswith('.ts'): continue
        path = os.path.join(actions_dir, f)
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        modified = False
        
        # Replace prisma.assetCategory -> prisma.category
        if 'prisma.assetCategory' in content:
            content = content.replace('prisma.assetCategory', 'prisma.category')
            modified = True
            
        # Replace prisma.itemCategory -> prisma.category
        if 'prisma.itemCategory' in content:
            content = content.replace('prisma.itemCategory', 'prisma.category')
            modified = True
            
        # Replace ItemCategory and AssetCategory types/includes to Category
        if 'assetCategory' in content and 'include' in content:
             content = re.sub(r'assetCategory\s*:\s*true', 'item: { include: { category: true } }', content)
             modified = True
             
        if 'itemCategory: true' in content:
             content = content.replace('itemCategory: true', 'category: true')
             modified = True
             
        if f == 'item-action.ts':
            content = content.replace('itemCategory: {', 'category: {')
            modified = True
            
        if modified:
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
                
replace_in_action_files()
