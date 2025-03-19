-- CreateTable
CREATE TABLE "ServiceRequested" (
    "id" UUID NOT NULL,
    "service_provider_id" UUID,
    "service_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "latitude_client" DOUBLE PRECISION,
    "longitude_client" DOUBLE PRECISION,
    "latitude_service_provider" DOUBLE PRECISION,
    "longitude_service_provider" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequested_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "ServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequested" ADD CONSTRAINT "ServiceRequested_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
