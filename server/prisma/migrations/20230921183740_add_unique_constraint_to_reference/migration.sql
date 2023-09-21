/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `tips` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tips_reference_key" ON "tips"("reference");
