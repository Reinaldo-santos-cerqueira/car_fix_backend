-- CreateTable
CREATE TABLE "ServiceProviderOnline" (
    "id" UUID NOT NULL,
    "service_provider_id" UUID NOT NULL,
    "socket_io_id" TEXT NOT NULL,
    "state" INTEGER NOT NULL,

    CONSTRAINT "ServiceProviderOnline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProviderOnline_service_provider_id_key" ON "ServiceProviderOnline"("service_provider_id");
