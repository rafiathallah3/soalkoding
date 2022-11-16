/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `diskusi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `diskusi_id_key` ON `diskusi`(`id`);
