/*
  Warnings:

  - You are about to drop the column `service_provider_id` on the `ServiceProviderOnline` table. All the data in the column will be lost.
  - You are about to drop the column `service_provider_id` on the `ServiceRequested` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ServiceRequested` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `ServiceProviderOnline` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ServiceRequested" DROP CONSTRAINT "ServiceRequested_service_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequested" DROP CONSTRAINT "ServiceRequested_user_id_fkey";

-- DropIndex
DROP INDEX "ServiceProviderOnline_service_provider_id_key";

-- AlterTable
ALTER TABLE "ServiceProviderOnline" DROP COLUMN "service_provider_id",
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "ServiceRequested" DROP COLUMN "service_provider_id",
DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID,
ADD COLUMN     "user_id_client" UUID,
ADD COLUMN     "user_id_provider_service" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderOnline_user_id_key" ON "ServiceProviderOnline"("user_id");

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_user_id_client_fkey" FOREIGN KEY ("user_id_client") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_user_id_provider_service_fkey" FOREIGN KEY ("user_id_provider_service") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProviderOnline" ADD CONSTRAINT "ServiceProviderOnline_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
