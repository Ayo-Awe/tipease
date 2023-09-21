/*
  Warnings:

  - Added the required column `amount` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenCount` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tips" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "tokenCount" INTEGER NOT NULL;
