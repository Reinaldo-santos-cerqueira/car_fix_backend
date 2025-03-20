-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "description" TEXT,
    "title" TEXT,
    "price_service" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "price_km_traveled" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
