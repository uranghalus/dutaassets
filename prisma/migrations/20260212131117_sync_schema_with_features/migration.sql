/*
  Warnings:

  - You are about to drop the column `metadata` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the `_departmenttoorganization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `department_id` to the `Karyawan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_departmenttoorganization` DROP FOREIGN KEY `_DepartmentToOrganization_A_fkey`;

-- DropForeignKey
ALTER TABLE `_departmenttoorganization` DROP FOREIGN KEY `_DepartmentToOrganization_B_fkey`;

-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_divisi_id_fkey`;

-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `Inventory_karyawan_id_fkey`;

-- DropIndex
DROP INDEX `user_email_idx` ON `user`;

-- AlterTable
ALTER TABLE `invitation` ADD COLUMN `teamId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `karyawan` ADD COLUMN `department_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `foto` TEXT NULL,
    ADD COLUMN `tempat_lahir` TEXT NULL,
    ADD COLUMN `tgl_lahir` DATETIME(3) NULL,
    ADD COLUMN `tgl_masuk` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `organization` DROP COLUMN `metadata`;

-- DropTable
DROP TABLE `_departmenttoorganization`;

-- DropTable
DROP TABLE `inventory`;

-- CreateTable
CREATE TABLE `asset_category` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `asset_category_org_name_unique`(`organizationId`, `name`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset` (
    `id_barang` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NULL,
    `karyawan_id` VARCHAR(191) NULL,
    `kode_asset` CHAR(50) NOT NULL,
    `nama_asset` TEXT NOT NULL,
    `kategori_asset` CHAR(100) NOT NULL,
    `deskripsi` TEXT NULL,
    `brand` CHAR(100) NULL,
    `model` CHAR(100) NULL,
    `serial_number` CHAR(100) NULL,
    `tgl_pembelian` DATETIME(3) NULL,
    `harga` DECIMAL(15, 2) NULL,
    `vendor` CHAR(100) NULL,
    `kondisi` CHAR(50) NULL,
    `lokasi` CHAR(200) NULL,
    `garansi_exp` DATETIME(3) NULL,
    `path_folder` TEXT NULL,
    `gambar` TEXT NULL,
    `expand_data` JSON NULL,
    `keterangan` TEXT NULL,
    `categoryId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'AVAILABLE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `asset_org_dept_idx`(`organization_id`, `department_id`),
    INDEX `asset_deleted_at_idx`(`deleted_at`),
    UNIQUE INDEX `asset_org_kode_unique`(`organization_id`, `kode_asset`),
    PRIMARY KEY (`id_barang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_loan` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `loanDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDate` DATETIME(3) NULL,
    `actualReturnDate` DATETIME(3) NULL,
    `status` CHAR(50) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `asset_loan_org_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_maintenance` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NOT NULL,
    `maintenanceDate` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NULL,
    `cost` DECIMAL(15, 2) NOT NULL,
    `description` TEXT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `asset_maintenance_org_idx`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_category` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `item_category_org_name_unique`(`organizationId`, `name`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `code` CHAR(50) NOT NULL,
    `name` TEXT NOT NULL,
    `category` VARCHAR(191) NULL,
    `unit` CHAR(20) NOT NULL,
    `minStock` INTEGER NOT NULL DEFAULT 0,
    `description` TEXT NULL,
    `image` TEXT NULL,
    `categoryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `item_org_code_unique`(`organizationId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warehouse` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `location` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock` (
    `id` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_warehouse_item_unique`(`warehouseId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_adjustment` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reason` TEXT NOT NULL,
    `reference` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'COMPLETED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_adjustment_item` (
    `id` VARCHAR(191) NOT NULL,
    `stockAdjustmentId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantityChange` INTEGER NOT NULL,
    `currentStock` INTEGER NOT NULL,
    `remarks` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requisition` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `requesterId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING_SUPERVISOR',
    `remarks` TEXT NULL,
    `warehouseId` VARCHAR(191) NULL,
    `supervisorAckBy` VARCHAR(191) NULL,
    `supervisorAckAt` DATETIME(3) NULL,
    `faManagerAckBy` VARCHAR(191) NULL,
    `faManagerAckAt` DATETIME(3) NULL,
    `gmApprovedBy` VARCHAR(191) NULL,
    `gmApprovedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requisition_item` (
    `id` VARCHAR(191) NOT NULL,
    `requisitionId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_transfer` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `fromWarehouseId` VARCHAR(191) NOT NULL,
    `toWarehouseId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'COMPLETED',
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_transfer_item` (
    `id` VARCHAR(191) NOT NULL,
    `stockTransferId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_receipt` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `warehouseId` VARCHAR(191) NOT NULL,
    `vendorName` TEXT NULL,
    `referenceNumber` TEXT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_receipt_item` (
    `id` VARCHAR(191) NOT NULL,
    `stockReceiptId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_log` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `details` JSON NULL,
    `ipAddress` TEXT NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activity_log_organizationId_idx`(`organizationId`),
    INDEX `activity_log_userId_idx`(`userId`),
    INDEX `activity_log_entityType_entityId_idx`(`entityType`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NULL,
    `kode_team` TEXT NULL,
    `keterangan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `team_organizationId_idx`(`organizationId`),
    INDEX `team_divisi_id_idx`(`divisi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teamMember` (
    `id` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'member',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `teamMember_teamId_idx`(`teamId`),
    INDEX `teamMember_userId_idx`(`userId`),
    UNIQUE INDEX `teamMember_team_user_unique`(`teamId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `karyawan_department_id_idx` ON `Karyawan`(`department_id`);

-- CreateIndex
CREATE INDEX `session_userId_idx_custom_v12` ON `session`(`userId`(191));

-- CreateIndex
CREATE INDEX `user_email_idx` ON `user`(`email`(191));

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Divisi` ADD CONSTRAINT `Divisi_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Karyawan` ADD CONSTRAINT `Karyawan_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id_department`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `asset_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id_department`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id_divisi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_karyawan_id_fkey` FOREIGN KEY (`karyawan_id`) REFERENCES `Karyawan`(`id_karyawan`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_loan` ADD CONSTRAINT `asset_loan_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id_barang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_loan` ADD CONSTRAINT `asset_loan_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Karyawan`(`id_karyawan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_maintenance` ADD CONSTRAINT `asset_maintenance_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id_barang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `item_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_adjustment` ADD CONSTRAINT `stock_adjustment_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_adjustment_item` ADD CONSTRAINT `stock_adjustment_item_stockAdjustmentId_fkey` FOREIGN KEY (`stockAdjustmentId`) REFERENCES `stock_adjustment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_adjustment_item` ADD CONSTRAINT `stock_adjustment_item_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisition` ADD CONSTRAINT `requisition_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `Karyawan`(`id_karyawan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisition` ADD CONSTRAINT `requisition_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisition_item` ADD CONSTRAINT `requisition_item_requisitionId_fkey` FOREIGN KEY (`requisitionId`) REFERENCES `requisition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisition_item` ADD CONSTRAINT `requisition_item_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer` ADD CONSTRAINT `stock_transfer_fromWarehouseId_fkey` FOREIGN KEY (`fromWarehouseId`) REFERENCES `warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer` ADD CONSTRAINT `stock_transfer_toWarehouseId_fkey` FOREIGN KEY (`toWarehouseId`) REFERENCES `warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_item` ADD CONSTRAINT `stock_transfer_item_stockTransferId_fkey` FOREIGN KEY (`stockTransferId`) REFERENCES `stock_transfer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_transfer_item` ADD CONSTRAINT `stock_transfer_item_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_receipt` ADD CONSTRAINT `stock_receipt_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_receipt_item` ADD CONSTRAINT `stock_receipt_item_stockReceiptId_fkey` FOREIGN KEY (`stockReceiptId`) REFERENCES `stock_receipt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_receipt_item` ADD CONSTRAINT `stock_receipt_item_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_log` ADD CONSTRAINT `activity_log_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_log` ADD CONSTRAINT `activity_log_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team` ADD CONSTRAINT `team_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id_divisi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamMember` ADD CONSTRAINT `teamMember_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teamMember` ADD CONSTRAINT `teamMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `account_userId_idx_custom_v10` ON `account`(`userId`);
DROP INDEX `account_userId_idx` ON `account`;

-- RedefineIndex
CREATE INDEX `department_deleted_at_idx_custom_v9` ON `Department`(`deleted_at`);
DROP INDEX `Department_deleted_at_idx` ON `department`;

-- RedefineIndex
CREATE INDEX `department_organization_id_idx_custom_v9` ON `Department`(`organization_id`);
DROP INDEX `Department_organization_id_idx` ON `department`;

-- RedefineIndex
CREATE UNIQUE INDEX `department_org_kode_unique_custom_v9` ON `Department`(`organization_id`, `kode_department`(191));
DROP INDEX `Department_organization_id_kode_department_key` ON `department`;

-- RedefineIndex
CREATE INDEX `divisi_deleted_at_idx_custom_v9` ON `Divisi`(`deleted_at`);
DROP INDEX `Divisi_deleted_at_idx` ON `divisi`;

-- RedefineIndex
CREATE INDEX `divisi_org_dept_idx_custom_v9` ON `Divisi`(`organization_id`, `department_id`);
DROP INDEX `Divisi_organization_id_department_id_idx` ON `divisi`;

-- RedefineIndex
CREATE INDEX `invitation_email_idx_custom_v9` ON `invitation`(`email`(191));
DROP INDEX `invitation_email_idx` ON `invitation`;

-- RedefineIndex
CREATE INDEX `invitation_organizationId_idx_custom_v9` ON `invitation`(`organizationId`);
DROP INDEX `invitation_organizationId_idx` ON `invitation`;

-- RedefineIndex
CREATE INDEX `karyawan_deleted_at_idx_custom_v9` ON `Karyawan`(`deleted_at`);
DROP INDEX `Karyawan_deleted_at_idx` ON `karyawan`;

-- RedefineIndex
CREATE UNIQUE INDEX `karyawan_org_nik_unique_custom_v9` ON `Karyawan`(`organization_id`, `nik`);
DROP INDEX `Karyawan_organization_id_nik_key` ON `karyawan`;

-- RedefineIndex
CREATE UNIQUE INDEX `karyawan_org_no_ktp_unique_custom_v9` ON `Karyawan`(`organization_id`, `no_ktp`);
DROP INDEX `Karyawan_organization_id_no_ktp_key` ON `karyawan`;

-- RedefineIndex
CREATE UNIQUE INDEX `karyawan_userId_unique_custom_v9` ON `Karyawan`(`userId`);
DROP INDEX `Karyawan_userId_key` ON `karyawan`;

-- RedefineIndex
CREATE INDEX `member_deleted_at_idx_custom_v9` ON `member`(`deleted_at`);
DROP INDEX `member_deleted_at_idx` ON `member`;

-- RedefineIndex
CREATE INDEX `member_organizationId_idx_custom_v9` ON `member`(`organizationId`);
DROP INDEX `member_organizationId_idx` ON `member`;

-- RedefineIndex
CREATE INDEX `member_userId_idx_custom_v9` ON `member`(`userId`);
DROP INDEX `member_userId_idx` ON `member`;

-- RedefineIndex
CREATE INDEX `organization_deleted_at_idx_custom` ON `organization`(`deleted_at`);
DROP INDEX `organization_deleted_at_idx` ON `organization`;

-- RedefineIndex
CREATE INDEX `organizationRole_role_idx_custom_v9` ON `organizationRole`(`role`(191));
DROP INDEX `organizationRole_role_idx` ON `organizationrole`;

-- RedefineIndex
CREATE INDEX `verification_identifier_idx_custom_v10` ON `verification`(`identifier`(191));
DROP INDEX `verification_identifier_idx` ON `verification`;
