/*
  Warnings:

  - The `status` column on the `ServiceRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ServiceRequested" DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
