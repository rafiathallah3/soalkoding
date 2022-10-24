/*
  Warnings:

  - You are about to drop the column `githuburl` on the `akun` table. All the data in the column will be lost.
  - You are about to drop the column `githubusername` on the `akun` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `akun` DROP COLUMN `githuburl`,
    DROP COLUMN `githubusername`;

-- CreateTable
CREATE TABLE `akungithub` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `iduser` VARCHAR(191) NULL,

    UNIQUE INDEX `akungithub_iduser_key`(`iduser`),
    UNIQUE INDEX `akungithub_email_username_key`(`email`, `username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `akungithub` ADD CONSTRAINT `akungithub_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
