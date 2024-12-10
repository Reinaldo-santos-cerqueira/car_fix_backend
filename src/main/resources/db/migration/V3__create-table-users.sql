CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    identifier VARCHAR(14) UNIQUE,
    password VARCHAR(255),
    token_phone VARCHAR(255),
    type VARCHAR(50),
    address_id UUID, 
    role VARCHAR(50),
    FOREIGN KEY (address_id) REFERENCES address(id)
);