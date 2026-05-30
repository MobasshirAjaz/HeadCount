/*
  Warnings:

  - You are about to drop the column `date` on the `Events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "date",
ADD COLUMN     "endDate" TEXT,
ADD COLUMN     "startDate" TEXT NOT NULL DEFAULT '';
