-- DropIndex
DROP INDEX `user_email_idx` ON `user`;

-- AlterTable
ALTER TABLE `session` ADD COLUMN `activeTeamId` TEXT NULL;

-- CreateIndex
CREATE INDEX `session_userId_idx_custom_v12` ON `session`(`userId`(191));

-- CreateIndex
CREATE INDEX `user_email_idx` ON `user`(`email`(191));
