/*
  Warnings:

  - You are about to alter the column `name` on the `currencies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(3)`.
  - A unique constraint covering the columns `[code]` on the table `currencies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `currencies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "currencies_name_key";

-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE CHAR(3);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");
