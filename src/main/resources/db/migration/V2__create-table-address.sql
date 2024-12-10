CREATE TABLE address (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    neighborhood VARCHAR(255),
    street VARCHAR(255),
    number VARCHAR(50), 
    city VARCHAR(255),
    state VARCHAR(255),
    cep VARCHAR(10)
);