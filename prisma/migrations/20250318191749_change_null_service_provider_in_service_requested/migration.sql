-- DropForeignKey
ALTER TABLE "ServiceRequested" DROP CONSTRAINT "ServiceRequested_service_provider_id_fkey";

-- AlterTable
ALTER TABLE "ServiceRequested" ALTER COLUMN "service_provider_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
