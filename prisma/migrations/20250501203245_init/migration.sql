/*
  Warnings:

  - You are about to drop the column `user_id` on the `Service` table. All the data in the column will be lost.
  - Added the required column `vehicle_id_client` to the `ServiceRequested` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "ServiceRequested" ADD COLUMN     "vehicle_id_client" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_vehicle_id_client_fkey" FOREIGN KEY ("vehicle_id_client") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
