/*
  Warnings:

  - You are about to drop the column `suka` on the `soal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `kumpulanjawaban` MODIFY `listjawaban` MEDIUMTEXT NOT NULL,
    MODIFY `contohjawaban` MEDIUMTEXT NOT NULL,
    MODIFY `jawabankode` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `soal` DROP COLUMN `suka`;
