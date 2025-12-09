-- Script to make a user admin
-- Usage: Run this SQL script in your PostgreSQL database
-- Replace 'your_username' with the actual username you want to make admin

-- Option 1: Make a specific user admin by username
UPDATE users 
SET role = 'admin' 
WHERE username = 'your_username';

-- Option 2: Make the first user admin (useful for initial setup)
-- UPDATE users 
-- SET role = 'admin' 
-- WHERE id = (SELECT MIN(id) FROM users);

-- Verify the change
SELECT id, username, role FROM users WHERE username = 'your_username';
