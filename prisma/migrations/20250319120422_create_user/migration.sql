-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token_phone" TEXT,
    "token_password_change" CHAR(6),
    "type" TEXT,
    "address_id" UUID,
    "role" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_identifier_key" ON "User"("identifier");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
