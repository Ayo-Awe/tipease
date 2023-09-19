/*
  Warnings:

  - Added the required column `bio` to the `pages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pages" ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "website_url" TEXT;
