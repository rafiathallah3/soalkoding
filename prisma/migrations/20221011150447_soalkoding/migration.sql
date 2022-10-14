-- CreateTable
CREATE TABLE `komentar` (
    `id` VARCHAR(15) NOT NULL,
    `idsolusi` VARCHAR(15) NOT NULL,
    `komen` TEXT NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `bikin` VARCHAR(13) NOT NULL,
    `upvote` TEXT NOT NULL DEFAULT '[]',
    `downvote` TEXT NOT NULL DEFAULT '[]',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `soal` (
    `id` VARCHAR(191) NOT NULL,
    `namasoal` TINYTEXT NOT NULL,
    `level` TINYINT NOT NULL,
    `tags` TINYTEXT NOT NULL,
    `soal` MEDIUMTEXT NOT NULL,
    `idpembuat` VARCHAR(20) NOT NULL,
    `public` BOOLEAN NOT NULL,
    `suka` TEXT NOT NULL DEFAULT '[]',
    `listjawaban` TEXT NOT NULL,
    `contohjawaban` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solusi` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `pintar` TEXT NOT NULL,
    `kode` MEDIUMTEXT NOT NULL,
    `bikin` VARCHAR(16) NOT NULL,
    `bahasa` VARCHAR(15) NOT NULL,
    `idsoal` VARCHAR(15) NOT NULL,
    `idsolusi` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `userid` VARCHAR(20) NOT NULL,
    `username` VARCHAR(15) NOT NULL,
    `nama` VARCHAR(35) NULL,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `bio` VARCHAR(65) NULL,
    `tinggal` VARCHAR(30) NULL,
    `githuburl` TINYTEXT NULL,
    `bikin` VARCHAR(14) NOT NULL,
    `terminate` BOOLEAN NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_idsolusi_fkey` FOREIGN KEY (`idsolusi`) REFERENCES `solusi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `soal` ADD CONSTRAINT `soal_idpembuat_fkey` FOREIGN KEY (`idpembuat`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
