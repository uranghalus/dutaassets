-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `username` TEXT NULL,
    `displayUsername` TEXT NULL,
    `role` TEXT NULL,
    `banned` BOOLEAN NULL DEFAULT false,
    `banReason` TEXT NULL,
    `banExpires` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` TEXT NULL,
    `userAgent` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `impersonatedBy` TEXT NULL,
    `activeOrganizationId` TEXT NULL,

    INDEX `session_userId_idx`(`userId`(191)),
    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` TEXT NOT NULL,
    `providerId` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` TEXT NULL,
    `password` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `account_userId_idx`(`userId`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `verification_identifier_idx`(`identifier`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `logo` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `metadata` TEXT NULL,

    UNIQUE INDEX `organization_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    INDEX `member_organizationId_idx`(`organizationId`(191)),
    INDEX `member_userId_idx`(`userId`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitation` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `email` TEXT NOT NULL,
    `role` TEXT NULL,
    `status` TEXT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inviterId` VARCHAR(191) NOT NULL,

    INDEX `invitation_organizationId_idx`(`organizationId`(191)),
    INDEX `invitation_email_idx`(`email`(191)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id_department` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `kode_department` TEXT NOT NULL,
    `nama_department` TEXT NOT NULL,
    `id_hod` TEXT NOT NULL,

    INDEX `Department_organization_id_idx`(`organization_id`),
    UNIQUE INDEX `Department_organization_id_kode_department_key`(`organization_id`, `kode_department`(191)),
    PRIMARY KEY (`id_department`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Divisi` (
    `id_divisi` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `nama_divisi` TEXT NOT NULL,
    `ext_tlp` TEXT NOT NULL,

    INDEX `Divisi_organization_id_department_id_idx`(`organization_id`, `department_id`),
    PRIMARY KEY (`id_divisi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Karyawan` (
    `id_karyawan` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NOT NULL,
    `nik` CHAR(50) NOT NULL,
    `nama` TEXT NOT NULL,
    `nama_alias` VARCHAR(191) NOT NULL,
    `alamat` LONGTEXT NOT NULL,
    `no_ktp` CHAR(16) NOT NULL,
    `telp` TEXT NOT NULL,
    `jabatan` TEXT NOT NULL,
    `call_sign` CHAR(150) NOT NULL,
    `status_karyawan` CHAR(50) NOT NULL,
    `keterangan` CHAR(150) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Karyawan_userId_key`(`userId`),
    UNIQUE INDEX `Karyawan_organization_id_nik_key`(`organization_id`, `nik`),
    UNIQUE INDEX `Karyawan_organization_id_no_ktp_key`(`organization_id`, `no_ktp`),
    PRIMARY KEY (`id_karyawan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id_barang` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `divisi_id` VARCHAR(191) NULL,
    `karyawan_id` VARCHAR(191) NULL,
    `kode_barang` CHAR(50) NOT NULL,
    `nama_barang` TEXT NOT NULL,
    `kelompok_barang` CHAR(100) NOT NULL,
    `deskripsi_barang` TEXT NULL,
    `merk` CHAR(100) NULL,
    `tipe_path_number` CHAR(100) NULL,
    `serial_number` CHAR(100) NULL,
    `tgl_pembelian` DATETIME(3) NULL,
    `harga` DOUBLE NULL,
    `tempat_pembelian` CHAR(100) NULL,
    `status_kondisi_barang` CHAR(50) NULL,
    `tempat_lokasi_barang` CHAR(200) NULL,
    `tgl_exp_paramsi` DATETIME(3) NULL,
    `path_folder` TEXT NULL,
    `gambar` TEXT NULL,
    `expand_data` JSON NULL,
    `keterangan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Inventory_organization_id_department_id_idx`(`organization_id`, `department_id`),
    UNIQUE INDEX `Inventory_organization_id_kode_barang_key`(`organization_id`, `kode_barang`),
    PRIMARY KEY (`id_barang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member` ADD CONSTRAINT `member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_inviterId_fkey` FOREIGN KEY (`inviterId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Divisi` ADD CONSTRAINT `Divisi_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id_department`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Karyawan` ADD CONSTRAINT `Karyawan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Karyawan` ADD CONSTRAINT `Karyawan_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id_divisi`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id_department`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id_divisi`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_karyawan_id_fkey` FOREIGN KEY (`karyawan_id`) REFERENCES `Karyawan`(`id_karyawan`) ON DELETE CASCADE ON UPDATE CASCADE;
