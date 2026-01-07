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
CREATE TABLE `Department` (
    `id_department` VARCHAR(191) NOT NULL,
    `kode_department` TEXT NOT NULL,
    `nama_department` TEXT NOT NULL,
    `id_hod` TEXT NOT NULL,

    PRIMARY KEY (`id_department`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Divisi` (
    `id_divisi` VARCHAR(191) NOT NULL,
    `nama_divisi` TEXT NOT NULL,
    `department_id` VARCHAR(191) NOT NULL,
    `ext_tlp` TEXT NOT NULL,

    PRIMARY KEY (`id_divisi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Karyawan` (
    `id_karyawan` VARCHAR(191) NOT NULL,
    `nik` CHAR(50) NOT NULL,
    `nama` TEXT NOT NULL,
    `nama_alias` VARCHAR(191) NOT NULL,
    `alamat` LONGTEXT NOT NULL,
    `no_ktp` CHAR(16) NOT NULL,
    `telp` TEXT NOT NULL,
    `divisi_id` VARCHAR(191) NOT NULL,
    `jabatan` TEXT NOT NULL,
    `call_sign` CHAR(150) NOT NULL,
    `status_karyawan` CHAR(50) NOT NULL,
    `keterangan` CHAR(150) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Karyawan_nik_key`(`nik`),
    UNIQUE INDEX `Karyawan_no_ktp_key`(`no_ktp`),
    PRIMARY KEY (`id_karyawan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id_barang` VARCHAR(191) NOT NULL,
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
    `id_penanggungjawab` CHAR(50) NULL,
    `status_kondisi_barang` CHAR(50) NULL,
    `department_permilik` CHAR(100) NULL,
    `tempat_jokasi_barang` CHAR(200) NULL,
    `tgl_exp_paramsi` DATETIME(3) NULL,
    `path_folder` TEXT NULL,
    `gambar` TEXT NULL,
    `expand_data` JSON NULL,
    `keterangan` TEXT NULL,
    `create_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `create_id_user` CHAR(50) NULL,
    `modified_date` DATETIME(3) NULL,
    `modified_id_user` CHAR(50) NULL,

    UNIQUE INDEX `Inventory_kode_barang_key`(`kode_barang`),
    PRIMARY KEY (`id_barang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Divisi` ADD CONSTRAINT `Divisi_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id_department`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Karyawan` ADD CONSTRAINT `Karyawan_divisi_id_fkey` FOREIGN KEY (`divisi_id`) REFERENCES `Divisi`(`id_divisi`) ON DELETE CASCADE ON UPDATE CASCADE;
