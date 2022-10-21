/*
  Warnings:

  - You are about to drop the column `hubunginGithub` on the `akun` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `akun` DROP COLUMN `hubunginGithub`,
    ADD COLUMN `githubstate` VARCHAR(30) NULL;
