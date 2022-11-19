-- CreateTable
CREATE TABLE `notifikasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iduserDari` VARCHAR(191) NOT NULL,
    `iduserKirim` VARCHAR(191) NOT NULL,
    `konten` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_iduserDari_fkey` FOREIGN KEY (`iduserDari`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_iduserKirim_fkey` FOREIGN KEY (`iduserKirim`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
