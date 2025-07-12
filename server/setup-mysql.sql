-- =================================================================
-- DROGUERIE JAMAL - MySQL Database Setup Script
-- =================================================================
-- Run this script to set up MySQL database for Droguerie Jamal
-- Usage: mysql -u root -p < setup-mysql.sql

-- Create database
CREATE DATABASE IF NOT EXISTS droguerie_jamal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'droguerie_user'@'localhost' IDENTIFIED BY 'droguerie_password123';
CREATE USER IF NOT EXISTS 'droguerie_user'@'%' IDENTIFIED BY 'droguerie_password123';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON droguerie_jamal.* TO 'droguerie_user'@'localhost';
GRANT ALL PRIVILEGES ON droguerie_jamal.* TO 'droguerie_user'@'%';

-- Flush privileges to ensure they take effect
FLUSH PRIVILEGES;

-- Select the database
USE droguerie_jamal;

-- Display success message
SELECT 'MySQL database setup completed successfully!' AS message;
