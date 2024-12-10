CREATE TABLE rel_user_service (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL,
    user_id UUID NOT NULL,
    price_service NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    price_km_traveled NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,    
    CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES service(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
);
