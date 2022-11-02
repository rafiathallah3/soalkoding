/*
  Warnings:

  - Added the required column `jawabankode` to the `KumpulanJawaban` table without a default value. This is not possible if the table is not empty.
  - Added the required column `liatankode` to the `KumpulanJawaban` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kumpulanjawaban` ADD COLUMN `jawabankode` VARCHAR(191) NOT NULL,
    ADD COLUMN `liatankode` VARCHAR(191) NOT NULL,
    MODIFY `listjawaban` VARCHAR(191) NOT NULL,
    MODIFY `contohjawaban` VARCHAR(191) NOT NULL;
