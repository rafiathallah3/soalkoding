/*
  Warnings:

  - A unique constraint covering the columns `[bahasa]` on the table `KumpulanJawaban` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `KumpulanJawaban_bahasa_key` ON `KumpulanJawaban`(`bahasa`);
