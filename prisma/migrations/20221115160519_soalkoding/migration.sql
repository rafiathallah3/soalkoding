/*
  Warnings:

  - The primary key for the `diskusi` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `akun` ADD COLUMN `admin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `moderator` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `diskusi` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`, `iduser`, `idsoal`);
