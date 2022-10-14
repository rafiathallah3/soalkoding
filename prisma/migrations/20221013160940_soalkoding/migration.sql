/*
  Warnings:

  - The primary key for the `komentar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `bikin` on the `komentar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(13)` to `DateTime(3)`.
  - The primary key for the `solusi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bikin` on the `solusi` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `solusi` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `komentar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `solusi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idusername` to the `solusi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `soal` DROP FOREIGN KEY `soal_idpembuat_fkey`;

-- AlterTable
ALTER TABLE `komentar` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `bikin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`, `idsolusi`);

-- AlterTable
ALTER TABLE `soal` ADD COLUMN `bikin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `solusi` DROP PRIMARY KEY,
    DROP COLUMN `bikin`,
    DROP COLUMN `username`,
    ADD COLUMN `idusername` VARCHAR(191) NOT NULL,
    ADD COLUMN `kapan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `pintar` TEXT NOT NULL DEFAULT '[]',
    MODIFY `idsoal` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`, `idsoal`, `idusername`);

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `akun` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `nama` VARCHAR(35) NULL,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `bio` VARCHAR(65) NULL,
    `tinggal` VARCHAR(30) NULL,
    `githuburl` TINYTEXT NULL,
    `perbaruiToken` TEXT NULL,
    `bikin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `terminate` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `akun_username_key`(`username`),
    UNIQUE INDEX `akun_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `komentar_id_key` ON `komentar`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `solusi_id_key` ON `solusi`(`id`);

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `soal_idpembuat_fkey` FOREIGN KEY (`idpembuat`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solusi` ADD CONSTRAINT `solusi_idsoal_fkey` FOREIGN KEY (`idsoal`) REFERENCES `soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solusi` ADD CONSTRAINT `solusi_idusername_fkey` FOREIGN KEY (`idusername`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
