/*
  Warnings:

  - You are about to alter the column `code` on the `currencies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(3)`.

*/
-- AlterTable
ALTER TABLE "currencies" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "code" SET DATA TYPE CHAR(3);
