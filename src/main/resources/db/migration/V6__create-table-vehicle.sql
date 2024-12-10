CREATE TABLE vehicle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model VARCHAR(255) NOT NULL,
    mark VARCHAR(255) NOT NULL,
    plate VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    path_to_document VARCHAR(255) NOT NULL
);