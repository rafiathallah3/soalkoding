/*
  Warnings:

  - The primary key for the `komentar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `komentar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `Int`.
  - You are about to drop the column `idsolusi` on the `solusi` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `komentar` DROP FOREIGN KEY `komentar_idsolusi_fkey`;

-- DropForeignKey
ALTER TABLE `soal` DROP FOREIGN KEY `soal_idpembuat_fkey`;

-- AlterTable
ALTER TABLE `komentar` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `idsolusi` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `soal` MODIFY `idpembuat` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `solusi` DROP COLUMN `idsolusi`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `userid`,
    MODIFY `username` VARCHAR(20) NOT NULL,
    MODIFY `terminate` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_idsolusi_fkey` FOREIGN KEY (`idsolusi`) REFERENCES `solusi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `soal_idpembuat_fkey` FOREIGN KEY (`idpembuat`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
