-- AlterTable
ALTER TABLE `akun` ADD COLUMN `gambarurl` VARCHAR(191) NOT NULL DEFAULT '/gambar/profile.png',
    ADD COLUMN `sudahVerifikasi` BOOLEAN NOT NULL DEFAULT false;
