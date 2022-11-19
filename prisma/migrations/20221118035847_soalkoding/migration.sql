/*
  Warnings:

  - Added the required column `tipe` to the `notifikasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifikasi` ADD COLUMN `tipe` VARCHAR(191) NOT NULL;
