-- AlterTable
ALTER TABLE `akun` ADD COLUMN `webiste` TINYTEXT NULL;

-- AlterTable
ALTER TABLE `soal` MODIFY `tags` TINYTEXT NOT NULL DEFAULT '[]',
    MODIFY `public` BOOLEAN NOT NULL DEFAULT false;
