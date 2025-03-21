/*
  Warnings:

  - The `status` column on the `ServiceRequested` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "ServiceRequested" DROP CONSTRAINT "ServiceRequested_service_provider_id_fkey";

-- AlterTable
ALTER TABLE "ServiceRequested" ADD COLUMN     "service_provider_socket_io_id" TEXT,
ADD COLUMN     "user_id_socket_io_id" TEXT,
ALTER COLUMN "service_provider_id" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ServiceProviderOnline" (
    "id" UUID NOT NULL,
    "service_provider_id" UUID NOT NULL,
    "socket_io_id" TEXT NOT NULL,
    "state" INTEGER NOT NULL,

    CONSTRAINT "ServiceProviderOnline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderOnline_service_provider_id_key" ON "ServiceProviderOnline"("service_provider_id");

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
