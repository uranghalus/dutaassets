/*
  Warnings:

  - You are about to drop the column `create_date` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `create_id_user` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `department_permilik` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `id_penanggungjawab` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `modified_date` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `modified_id_user` on the `inventory` table. All the data in the column will be lost.
  - You are about to drop the column `tempat_jokasi_barang` on the `inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organization_id,kode_barang]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `department_id` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Inventory_kode_barang_key` ON `inventory`;

-- AlterTable
ALTER TABLE `inventory` DROP COLUMN `create_date`,
    DROP COLUMN `create_id_user`,
    DROP COLUMN `department_permilik`,
    DROP COLUMN `id_penanggungjawab`,
    DROP COLUMN `modified_date`,
    DROP COLUMN `modified_id_user`,
    DROP COLUMN `tempat_jokasi_barang`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `department_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `divisi_id` VARCHAR(191) NULL,
    ADD COLUMN `karyawan_id` VARCHAR(191) NULL,
    ADD COLUMN `organization_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `tempat_lokasi_barang` CHAR(200) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `account_userId_idx` ON `account`(`userId`(191));

-- CreateIndex
CREATE INDEX `Inventory_organization_id_department_id_idx` ON `Inventory`(`organization_id`, `department_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Inventory_organization_id_kode_barang_key` ON `Inventory`(`organization_id`, `kode_barang`);

-- CreateIndex
CREATE INDEX `invitation_organizationId_idx` ON `invitation`(`organizationId`(191));

-- CreateIndex
CREATE INDEX `member_organizationId_idx` ON `member`(`organizationId`(191));

-- CreateIndex
CREATE INDEX `member_userId_idx` ON `member`(`userId`(191));

-- CreateIndex
CREATE INDEX `session_userId_idx` ON `session`(`userId`(191));

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id_department`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id_divisi`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_karyawan_id_fkey` FOREIGN KEY (`karyawan_id`) REFERENCES `Karyawan`(`id_karyawan`) ON DELETE CASCADE ON UPDATE CASCADE;
