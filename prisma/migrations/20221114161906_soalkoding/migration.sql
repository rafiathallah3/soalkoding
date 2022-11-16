-- AlterTable
ALTER TABLE `favorit` ADD COLUMN `kapan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `diskusi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `iduser` VARCHAR(191) NOT NULL,
    `idsoal` VARCHAR(191) NOT NULL,
    `bikin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `upvote` TEXT NOT NULL DEFAULT '[]',
    `downvote` TEXT NOT NULL DEFAULT '[]',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diskusi` ADD CONSTRAINT `diskusi_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diskusi` ADD CONSTRAINT `diskusi_idsoal_fkey` FOREIGN KEY (`idsoal`) REFERENCES `soal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
