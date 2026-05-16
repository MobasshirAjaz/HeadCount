/*
  Warnings:

  - The `endDate` column on the `Events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `startDate` column on the `Events` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3),
DROP COLUMN "startDate",
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
