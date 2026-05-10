/*
  Warnings:

  - A unique constraint covering the columns `[judgePin]` on the table `Judge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Judge_judgePin_key" ON "Judge"("judgePin");
