CREATE TABLE service (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description VARCHAR(255),
    title VARCHAR(255)
);
