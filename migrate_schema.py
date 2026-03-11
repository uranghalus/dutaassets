import re

def update_schema():
    with open('d:\\NextJs\\dutaassets\\prisma\\schema.prisma', 'r') as f:
        content = f.read()

    # 1. Replace AssetCategory and ItemCategory with Category
    content = re.sub(r'model AssetCategory \{.*?\n\}', '', content, flags=re.DOTALL)
    content = re.sub(r'model ItemCategory \{.*?\n\}', 
'''enum ItemType {
  ASSET
  CONSUMABLE
}

model Category {
  id             String          @id @default(uuid())
  organizationId String
  name           String          @db.Text
  description    String?         @db.Text
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
  items          Item[]
  assetTransfers AssetTransfer[]

  @@unique([organizationId, name(length: 191)], map: "category_org_name_unique")
  @@map("category")
}''', content, flags=re.DOTALL)

    # 2. Update Asset model
    asset_model = r'''model Asset {
  id_barang       String    @id @default(uuid())
  organization_id String
  department_id   String
  divisi_id       String?
  karyawan_id     String?
  itemId          String
  serial_number   String?   @db.Char(100)
  tgl_pembelian   DateTime?
  kondisi         String?   @db.Char(50)
  lokasi          String?   @db.Char(200)
  locationId      String?
  garansi_exp     DateTime?

  // EAM Fields
  barcode         String?  @db.Char(100)
  salvageValue    Decimal? @db.Decimal(15, 2) // Residue value after useful life
  usefulLifeYears Int? // Estimated useful life in years

  status                    AssetStatus                @default(AVAILABLE)
  createdAt                 DateTime                   @default(now())
  updatedAt                 DateTime                   @updatedAt
  
  item                      Item                       @relation(fields: [itemId], references: [id])
  department_fk             Department                 @relation(fields: [department_id], references: [id_department])
  divisi_fk                 Divisi?                    @relation(fields: [divisi_id], references: [id_divisi])
  karyawan_fk               Karyawan?                  @relation(fields: [karyawan_id], references: [id_karyawan])
  assetLocation             AssetLocation?             @relation(fields: [locationId], references: [id])
  assetDepreciations        AssetDepreciation[]
  assetLoans                AssetLoan[]
  assetMaintenances         AssetMaintenance[]
  assetTransfers            AssetTransfer[]
  assetDisposals            AssetDisposal[]
  assetMaintenanceSchedules AssetMaintenanceSchedule[]

  safetyEquipment SafetyEquipment?

  @@index([itemId], map: "asset_itemId_fkey")
  @@index([department_id], map: "asset_department_id_fkey")
  @@index([divisi_id], map: "asset_divisi_id_fkey")
  @@index([karyawan_id], map: "asset_karyawan_id_fkey")
  @@index([locationId], map: "asset_locationId_fkey")
  @@map("asset")
}'''
    content = re.sub(r'model Asset \{.*?\n\}', asset_model, content, flags=re.DOTALL)

    # 3. Update Item model
    item_model = r'''model Item {
  id                   String                @id @default(uuid())
  organizationId       String
  code                 String                @db.Char(50)
  name                 String                @db.Text
  type                 ItemType              @default(CONSUMABLE)
  unit                 String                @db.Char(20)
  minStock             Int                   @default(0)
  description          String?               @db.Text
  image                String?               @db.Text
  categoryId           String?
  
  // Asset-specific fields in Catalog
  brand                String?               @db.Char(100)
  model                String?               @db.Char(100)
  vendorName           String?               @db.Char(100)
  purchaseValue        Decimal?              @db.Decimal(15, 2)

  createdAt            DateTime              @default(now())
  updatedAt            DateTime              @updatedAt
  
  category             Category?             @relation(fields: [categoryId], references: [id])
  assets               Asset[]
  
  requisitionItems     RequisitionItem[]
  stocks               Stock[]
  stockAdjustmentItems StockAdjustmentItem[]
  stockLedgers         StockLedger[]
  stockReceiptItems    StockReceiptItem[]
  stockTransferItems   StockTransferItem[]
  stockIssuanceItems   StockIssuanceItem[]

  @@unique([organizationId, code], map: "item_org_code_unique")
  @@index([categoryId], map: "item_categoryId_fkey")
  @@map("item")
}'''
    content = re.sub(r'model Item \{.*?\n\}', item_model, content, flags=re.DOTALL)

    # 4. Replace other AssetCategory references
    content = content.replace('AssetCategory?', 'Category?')
    content = content.replace('AssetCategory', 'Category')
    # 5. Fix AssetTransfer
    content = content.replace('assetCategory  Category? @relation(fields: [categoryId], references: [id])', 'category  Category? @relation(fields: [categoryId], references: [id])')
    # 6. Fix ItemCategory
    content = content.replace('ItemCategory?', 'Category?')
    content = content.replace('ItemCategory', 'Category')
    content = content.replace('itemCategory         Category?', 'category         Category?')

    with open('d:\\NextJs\\dutaassets\\prisma\\schema.prisma', 'w') as f:
        f.write(content)

if __name__ == '__main__':
    update_schema()
