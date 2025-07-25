#!/bin/bash

# =================================================================
# DROGUERIE JAMAL - PRODUCTION MYSQL SETUP SCRIPT
# =================================================================
# This script sets up MySQL database for production deployment
# Run with: bash scripts/setup-production-mysql.sh

set -e  # Exit on any error

echo "🏪 Droguerie Jamal - Production MySQL Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f "server/.env.production" ]; then
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    echo "Please copy server/.env.production and fill in your MySQL credentials"
    exit 1
fi

# Load production environment variables
set -a
source server/.env.production
set +a

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Database Host: ${DB_HOST}"
echo "  Database Name: ${DB_NAME}"
echo "  Database User: ${DB_USER}"
echo ""

# Function to run MySQL commands
run_mysql() {
    mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" "$@"
}

# Test MySQL connection
echo -e "${YELLOW}🔍 Testing MySQL connection...${NC}"
if run_mysql -e "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL connection successful${NC}"
else
    echo -e "${RED}❌ MySQL connection failed${NC}"
    echo "Please check your credentials in .env.production"
    exit 1
fi

# Create database if it doesn't exist
echo -e "${YELLOW}🗄️ Creating database...${NC}"
run_mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
echo -e "${GREEN}✅ Database '${DB_NAME}' ready${NC}"

# Run migration script
echo -e "${YELLOW}🔄 Running database migration...${NC}"
cd server
if node migrate-to-mysql.js; then
    echo -e "${GREEN}✅ Database migration completed${NC}"
else
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
fi

# Seed production data
echo -e "${YELLOW}🌱 Seeding production data...${NC}"
if DATABASE_TYPE=mysql npm run seed:mysql; then
    echo -e "${GREEN}✅ Database seeding completed${NC}"
else
    echo -e "${RED}❌ Database seeding failed${NC}"
    exit 1
fi

# Test application connection
echo -e "${YELLOW}🧪 Testing application connection...${NC}"
if node -e "
const { initializeDatabase } = require('./config/db.js');
initializeDatabase().then(() => {
  console.log('✅ Application MySQL connection successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Application MySQL connection failed:', err.message);
  process.exit(1);
});
"; then
    echo -e "${GREEN}✅ Application can connect to MySQL${NC}"
else
    echo -e "${RED}❌ Application cannot connect to MySQL${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Production MySQL setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "  ✅ MySQL database created and configured"
echo "  ✅ Database tables migrated"
echo "  ✅ Sample data seeded"
echo "  ✅ Application connection verified"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. Update your production .env file with these MySQL credentials"
echo "  2. Deploy your application"
echo "  3. Test all functionality in production"
echo ""
echo -e "${BLUE}🔐 Admin Access:${NC}"
echo "  Email: admin@drogueriejamal.ma"
echo "  Password: admin123 (CHANGE IN PRODUCTION!)"
echo ""
