/*
  Warnings:

  - You are about to drop the `donations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activated_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "donations";

-- CreateTable
CREATE TABLE "tips" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "email" VARCHAR(255) NOT NULL,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_currencyCode_key" ON "countries"("currencyCode");

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
