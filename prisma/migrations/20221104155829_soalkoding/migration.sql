-- DropForeignKey
ALTER TABLE `akungithub` DROP FOREIGN KEY `akungithub_iduser_fkey`;

-- DropForeignKey
ALTER TABLE `komentar` DROP FOREIGN KEY `komentar_iduser_fkey`;

-- DropForeignKey
ALTER TABLE `solusi` DROP FOREIGN KEY `solusi_idusername_fkey`;

-- CreateTable
CREATE TABLE `favorit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idsoal` VARCHAR(191) NOT NULL,
    `iduser` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`, `idsoal`, `iduser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favorit` ADD CONSTRAINT `favorit_idsoal_fkey` FOREIGN KEY (`idsoal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorit` ADD CONSTRAINT `favorit_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solusi` ADD CONSTRAINT `solusi_idusername_fkey` FOREIGN KEY (`idusername`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `akungithub` ADD CONSTRAINT `akungithub_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
