/*
  Warnings:

  - Added the required column `minimumTipAmount` to the `currencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "minimumTipAmount" INTEGER NOT NULL;
