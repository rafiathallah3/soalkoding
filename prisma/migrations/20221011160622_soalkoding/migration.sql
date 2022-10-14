/*
  Warnings:

  - You are about to alter the column `bikin` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(14)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `bikin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
