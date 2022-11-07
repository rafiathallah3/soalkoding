-- DropForeignKey
ALTER TABLE `komentar` DROP FOREIGN KEY `komentar_iduser_fkey`;

-- DropForeignKey
ALTER TABLE `solusi` DROP FOREIGN KEY `solusi_idusername_fkey`;

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solusi` ADD CONSTRAINT `solusi_idusername_fkey` FOREIGN KEY (`idusername`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
