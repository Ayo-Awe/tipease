/*
  Warnings:

  - You are about to drop the column `minimumTipAmount` on the `currencies` table. All the data in the column will be lost.
  - Added the required column `minimum_tip_amount` to the `currencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currencies" DROP COLUMN "minimumTipAmount",
ADD COLUMN     "minimum_tip_amount" INTEGER NOT NULL;
