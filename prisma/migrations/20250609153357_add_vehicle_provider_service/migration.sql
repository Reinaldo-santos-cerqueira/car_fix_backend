-- AlterTable
ALTER TABLE "ServiceRequested" ADD COLUMN     "vehicle_id_service_provider" UUID;

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_vehicle_id_service_provider_fkey" FOREIGN KEY ("vehicle_id_service_provider") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
