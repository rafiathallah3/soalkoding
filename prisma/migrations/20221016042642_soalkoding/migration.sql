/*
  Warnings:

  - The primary key for the `komentar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `komentar` table. All the data in the column will be lost.
  - Added the required column `iduser` to the `komentar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `komentar` DROP PRIMARY KEY,
    DROP COLUMN `username`,
    ADD COLUMN `iduser` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`, `idsolusi`, `iduser`);

-- AddForeignKey
ALTER TABLE `komentar` ADD CONSTRAINT `komentar_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `akun`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
