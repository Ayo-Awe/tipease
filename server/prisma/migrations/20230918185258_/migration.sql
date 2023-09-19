/*
  Warnings:

  - You are about to drop the column `minimum_tip_amount` on the `currencies` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_token` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the column `tip_currency_id` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the column `accountName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bankCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `bankName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `countries` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `currencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_code` to the `currencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_tip_amount` to the `currencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerk_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pages" DROP CONSTRAINT "pages_tip_currency_id_fkey";

-- DropIndex
DROP INDEX "users_clerkId_key";

-- AlterTable
ALTER TABLE "currencies" DROP COLUMN "minimum_tip_amount",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "country_code" TEXT NOT NULL,
ADD COLUMN     "default_tip_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pages" DROP COLUMN "price_per_token",
DROP COLUMN "tip_currency_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "accountName",
DROP COLUMN "accountNumber",
DROP COLUMN "bankCode",
DROP COLUMN "bankName",
DROP COLUMN "clerkId",
ADD COLUMN     "account_name" TEXT,
ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "bank_code" TEXT,
ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "clerk_id" TEXT NOT NULL,
ADD COLUMN     "payment_currency_id" INTEGER,
ADD COLUMN     "price_per_token" INTEGER;

-- DropTable
DROP TABLE "countries";

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_payment_currency_id_fkey" FOREIGN KEY ("payment_currency_id") REFERENCES "currencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
