-- Query File for PG Management Database
-- Use this file to run queries against your database

-- View all users
SELECT * FROM users;

-- View all properties
SELECT * FROM properties;

-- View all rooms
SELECT * FROM rooms;

-- View all bookings
SELECT * FROM bookings;

-- View all payments
SELECT * FROM payments;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'payments', COUNT(*) FROM payments;

-- View properties with owner details
SELECT p.*, u.first_name, u.last_name, u.email as owner_email
FROM properties p
JOIN users u ON p.owner_id = u.id;

-- View bookings with tenant and room details
SELECT 
    b.*,
    r.room_number,
    r.room_type,
    u.first_name,
    u.last_name,
    u.email as tenant_email
FROM bookings b
JOIN rooms r ON b.room_id = r.id
JOIN users u ON b.tenant_id = u.id;
