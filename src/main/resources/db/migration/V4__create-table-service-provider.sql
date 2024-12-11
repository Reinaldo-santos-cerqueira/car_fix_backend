CREATE TABLE service_provider (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    path_to_image_cnh VARCHAR(255), 
    cnh CHAR(11) UNIQUE,
    user_id UUID,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
