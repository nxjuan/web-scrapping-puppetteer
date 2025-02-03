
CREATE TABLE IF NOT EXISTS voos (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255),
    seat VARCHAR(255),
    departureTime VARCHAR(255),
    arrivalTime VARCHAR(255),
    origin VARCHAR(255),
    destination VARCHAR(255),
    duration VARCHAR(255),
    price VARCHAR(255),
    flightType VARCHAR(255),
    date TIMESTAMP
);