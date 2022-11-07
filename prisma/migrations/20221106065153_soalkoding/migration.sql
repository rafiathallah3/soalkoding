/*
  Warnings:

  - The primary key for the `favorit` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `favorit` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id`);
