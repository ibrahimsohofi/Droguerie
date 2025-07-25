# 🐬 MySQL Setup Guide for Droguerie Jamal

## 📋 Overview
This guide helps you migrate from SQLite to MySQL for better performance, scalability, and production readiness.

## 🚀 Quick Setup Options

### Option 1: Local MySQL Installation

#### 1. **Install MySQL Server**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS (with Homebrew)
brew install mysql

# Windows: Download from https://dev.mysql.com/downloads/mysql/
```

#### 2. **Start MySQL Service**
```bash
# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql

# macOS
brew services start mysql

# Windows: Start MySQL service from Services panel
```

#### 3. **Secure MySQL Installation**
```bash
sudo mysql_secure_installation
```

#### 4. **Set up Database and User**
```bash
# Run the setup script
mysql -u root -p < server/setup-mysql.sql
```

#### 5. **Update Environment Variables**
Update `server/.env`:
```env
DATABASE_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=droguerie_user
DB_PASSWORD=droguerie_password123
DB_NAME=droguerie_jamal
```

#### 6. **Seed the Database**
```bash
cd server
bun run seed:mysql
```

### Option 2: Cloud MySQL Services

#### **PlanetScale (Recommended)**
1. Visit [planetscale.com](https://planetscale.com)
2. Create a free account
3. Create a new database: `droguerie-jamal`
4. Get connection details from dashboard
5. Update `.env` file:
```env
DATABASE_TYPE=mysql
DB_HOST=your-host.planetscale.sh
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=droguerie-jamal
```

#### **MySQL on Railway**
1. Visit [railway.app](https://railway.app)
2. Create MySQL service
3. Copy connection details
4. Update `.env` file accordingly

#### **AWS RDS MySQL**
1. Create RDS MySQL instance
2. Configure security groups
3. Update connection details in `.env`

#### **DigitalOcean Managed MySQL**
1. Create managed MySQL database
2. Configure firewall rules
3. Update connection details in `.env`

## 🔧 Configuration Details

### Environment Variables
```env
# Primary database configuration
DATABASE_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=droguerie_user
DB_PASSWORD=droguerie_password123
DB_NAME=droguerie_jamal

# SQLite fallback (if MySQL fails)
FALLBACK_DATABASE_URL=./database.sqlite
```

### Connection Pool Settings
The application automatically configures:
- Connection limit: 10
- Queue limit: 0
- Acquire timeout: 60 seconds
- Reconnection: Enabled

## 📊 Database Schema

### Tables Created
- **categories** - Product categories with multilingual support
- **products** - Products with inventory management
- **users** - User accounts with role-based access
- **orders** - Order management and tracking
- **order_items** - Individual order line items
- **cart** - Shopping cart functionality
- **reviews** - Product reviews and ratings
- **coupons** - Discount coupon system
- **user_coupons** - Coupon usage tracking
- **wishlist** - User wishlist functionality
- **site_settings** - Application configuration
- **email_verification_tokens** - Email verification
- **password_reset_tokens** - Password reset functionality

## 🔄 Migration from SQLite

### Automatic Migration
If you have existing SQLite data:
```bash
cd server
node migrate-to-mysql.js
```

### Manual Migration
1. Export SQLite data:
```bash
sqlite3 database.sqlite .dump > sqlite_dump.sql
```

2. Convert to MySQL format (manual editing required)
3. Import to MySQL:
```bash
mysql -u droguerie_user -p droguerie_jamal < converted_dump.sql
```

## 🧪 Testing MySQL Connection

### Test Connection
```bash
cd server
node -e "
const { initializeDatabase } = require('./config/db.js');
initializeDatabase().then(() => {
  console.log('✅ MySQL connection successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ MySQL connection failed:', err.message);
  process.exit(1);
});
"
```

### Verify Tables
```bash
mysql -u droguerie_user -p droguerie_jamal -e "SHOW TABLES;"
```

### Check Data
```bash
mysql -u droguerie_user -p droguerie_jamal -e "
SELECT
  (SELECT COUNT(*) FROM categories) as categories,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM users) as users;
"
```

## 🚀 Starting the Application

1. **Start the servers:**
```bash
# Backend (from server directory)
cd server && bun run dev

# Frontend (from client directory)
cd client && bun run dev
```

2. **Verify MySQL is being used:**
Check server logs for:
```
✅ MySQL database connected successfully
📊 Using MySQL database
✅ MySQL database tables created successfully
```

## 🔍 Troubleshooting

### Common Issues

#### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Make sure MySQL server is running
```bash
sudo systemctl status mysql  # Check status
sudo systemctl start mysql   # Start if stopped
```

#### Access Denied
```
Error: Access denied for user 'droguerie_user'@'localhost'
```
**Solution:** Re-run the setup script
```bash
mysql -u root -p < server/setup-mysql.sql
```

#### Database Doesn't Exist
```
Error: Unknown database 'droguerie_jamal'
```
**Solution:** Create the database manually
```sql
CREATE DATABASE droguerie_jamal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### SQLite Fallback Activated
```
⚠️  MySQL connection failed: ...
🔄 Falling back to SQLite...
📊 Using SQLite database (fallback)
```
**Solution:** Check MySQL configuration and credentials

### Performance Optimization

#### Enable Query Cache
```sql
SET GLOBAL query_cache_size = 268435456;  -- 256MB
SET GLOBAL query_cache_type = ON;
```

#### Optimize for InnoDB
```sql
SET GLOBAL innodb_buffer_pool_size = 536870912;  -- 512MB
```

#### Index Optimization
The application automatically creates necessary indexes, including:
- Primary keys on all tables
- Foreign key constraints
- Unique indexes for email addresses
- Composite indexes for cart and wishlist

## 📈 Production Considerations

### Security
- Use strong passwords
- Enable SSL/TLS connections
- Configure firewall rules
- Regular security updates

### Backup Strategy
```bash
# Daily backup
mysqldump -u droguerie_user -p droguerie_jamal > backup_$(date +%Y%m%d).sql

# Automated backup script
0 2 * * * /usr/bin/mysqldump -u droguerie_user -p droguerie_jamal > /backups/droguerie_$(date +\%Y\%m\%d).sql
```

### Monitoring
- Monitor connection pool usage
- Track slow queries
- Set up alerts for connection failures
- Monitor disk space usage

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your MySQL version (5.7+ recommended)
3. Check server logs for detailed error messages
4. Ensure all environment variables are correctly set

## ✅ Verification Checklist

- [ ] MySQL server installed and running
- [ ] Database and user created successfully
- [ ] Environment variables updated
- [ ] Database seeded with sample data
- [ ] Application starts without errors
- [ ] Admin login works (admin@drogueriejamal.ma / admin123)
- [ ] Products display correctly
- [ ] MySQL logs show successful connection
