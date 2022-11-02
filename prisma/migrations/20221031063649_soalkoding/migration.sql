/*
  Warnings:

  - You are about to drop the column `contohjawaban` on the `soal` table. All the data in the column will be lost.
  - You are about to drop the column `listjawaban` on the `soal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `komentar` DROP FOREIGN KEY `komentar_idsolusi_fkey`;

-- DropForeignKey
ALTER TABLE `soal` DROP FOREIGN KEY `soal_idpembuat_fkey`;

-- DropForeignKey
ALTER TABLE `solusi` DROP FOREIGN KEY `solusi_idsoal_fkey`;

-- AlterTable
ALTER TABLE `soal` DROP COLUMN `contohjawaban`,
    DROP COLUMN `listjawaban`;

-- CreateTable
CREATE TABLE `KumpulanJawaban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idsoal` VARCHAR(191) NOT NULL,
    `listjawaban` TEXT NOT NULL,
    `contohjawaban` TEXT NOT NULL,
    `bahasa` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_idsolusi_fkey` FOREIGN KEY (`idsolusi`) REFERENCES `solusi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KumpulanJawaban` ADD CONSTRAINT `KumpulanJawaban_idsoal_fkey` FOREIGN KEY (`idsoal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `soal_idpembuat_fkey` FOREIGN KEY (`idpembuat`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solusi` ADD CONSTRAINT `solusi_idsoal_fkey` FOREIGN KEY (`idsoal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
