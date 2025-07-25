# 🏭 Production MySQL Setup Guide - Droguerie Jamal

## 🚀 Quick Production Setup

### Option 1: PlanetScale (Recommended - Free Tier Available)

**Why PlanetScale?**
- ✅ Free tier with 1GB storage
- ✅ Automatic backups
- ✅ Built-in SSL/TLS
- ✅ Easy scaling
- ✅ Global edge locations

**Setup Steps:**

1. **Create Account**
   ```bash
   # Visit: https://planetscale.com
   # Sign up with GitHub/Google
   ```

2. **Create Database**
   ```bash
   # Database name: droguerie-jamal
   # Region: Choose closest to Morocco (Europe West)
   ```

3. **Get Connection Details**
   ```bash
   # Copy connection string from dashboard
   # Format: mysql://username:password@host:port/database
   ```

4. **Update Production Environment**
   ```bash
   cp server/.env.production server/.env
   # Edit with your PlanetScale credentials:
   DB_HOST=your-host.connect.psdb.cloud
   DB_PORT=3306
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=droguerie-jamal
   DATABASE_TYPE=mysql
   ```

5. **Run Migration**
   ```bash
   chmod +x scripts/setup-production-mysql.sh
   bash scripts/setup-production-mysql.sh
   ```

### Option 2: Railway (Easy Deploy)

1. **Create Railway Account**
   ```bash
   # Visit: https://railway.app
   # Connect GitHub account
   ```

2. **Add MySQL Service**
   ```bash
   # Create new project
   # Add MySQL database service
   # Copy connection variables
   ```

3. **Configure Environment**
   ```bash
   DB_HOST=containers-us-west-xxx.railway.app
   DB_PORT=xxxx
   DB_USER=root
   DB_PASSWORD=railway-generated-password
   DB_NAME=railway
   ```

### Option 3: DigitalOcean Managed Database

1. **Create Managed Database**
   ```bash
   # Visit: https://cloud.digitalocean.com
   # Create → Databases → MySQL 8.0
   # Choose region closest to your users
   ```

2. **Configure Connection**
   ```bash
   DB_HOST=your-db-cluster.mysql.database.xxx.com
   DB_PORT=25060
   DB_USER=doadmin
   DB_PASSWORD=generated-password
   DB_NAME=defaultdb
   ```

### Option 4: AWS RDS (Enterprise)

1. **Create RDS Instance**
   ```bash
   # AWS Console → RDS → Create Database
   # Engine: MySQL 8.0
   # Template: Free tier (for testing)
   ```

2. **Security Groups**
   ```bash
   # Configure security groups to allow connections
   # Add your server IP to allowed connections
   ```

## 🔧 Environment Configuration

### Production Environment File

Create `server/.env` from `server/.env.production`:

```env
# Database Configuration
DATABASE_TYPE=mysql
DB_HOST=your-production-mysql-host
DB_PORT=3306
DB_USER=your-mysql-username
DB_PASSWORD=your-secure-mysql-password
DB_NAME=droguerie_jamal_prod

# Security (Generate strong secrets!)
JWT_SECRET=your-super-secure-jwt-secret-at-least-64-characters-long
REFRESH_TOKEN_SECRET=your-super-secure-refresh-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@drogueriejamal.ma
SMTP_PASS=your-gmail-app-password

# Stripe Live Keys
STRIPE_SECRET_KEY=sk_live_your_stripe_live_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_publishable
```

## 🚀 Migration Process

### Automated Setup (Recommended)

```bash
# 1. Configure your .env file with MySQL credentials
cp server/.env.production server/.env
# Edit server/.env with your MySQL details

# 2. Run automated setup
chmod +x scripts/setup-production-mysql.sh
bash scripts/setup-production-mysql.sh
```

### Manual Setup (Step by Step)

```bash
# 1. Test connection
cd server
node -e "
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'your-host',
  user: 'your-user',
  password: 'your-password',
  database: 'your-database'
});
pool.execute('SELECT 1', (err, results) => {
  if (err) throw err;
  console.log('✅ Connection successful');
  process.exit(0);
});
"

# 2. Create database
mysql -h your-host -u your-user -p -e "
CREATE DATABASE IF NOT EXISTS droguerie_jamal_prod
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"

# 3. Run migration
DATABASE_TYPE=mysql node migrate-to-mysql.js

# 4. Seed data
DATABASE_TYPE=mysql npm run seed:mysql

# 5. Start application
npm start
```

## 🔍 Verification Steps

### 1. Test Database Connection
```bash
cd server
node -e "
const { initializeDatabase } = require('./config/db.js');
initializeDatabase().then(() => {
  console.log('✅ MySQL connection successful!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});
"
```

### 2. Verify Tables Created
```bash
mysql -h your-host -u your-user -p your-database -e "SHOW TABLES;"
```

### 3. Check Sample Data
```bash
mysql -h your-host -u your-user -p your-database -e "
SELECT
  (SELECT COUNT(*) FROM categories) as categories,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM users) as users;
"
```

### 4. Test Admin Login
```bash
# Visit your application
# Login with: admin@drogueriejamal.ma / admin123
# Verify dashboard loads correctly
```

## 🔒 Security Checklist

### Database Security
- [ ] Use strong, unique passwords
- [ ] Enable SSL/TLS connections
- [ ] Restrict IP access to necessary servers only
- [ ] Regular security updates
- [ ] Enable audit logging

### Application Security
- [ ] Generate new JWT secrets for production
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting

### Monitoring & Maintenance
- [ ] Set up database backups (daily)
- [ ] Monitor connection pool usage
- [ ] Set up alerting for failures
- [ ] Monitor slow queries
- [ ] Regular performance optimization

## 📊 Performance Optimization

### Database Optimization
```sql
-- Enable query cache
SET GLOBAL query_cache_size = 268435456;  -- 256MB
SET GLOBAL query_cache_type = ON;

-- Optimize InnoDB
SET GLOBAL innodb_buffer_pool_size = 536870912;  -- 512MB

-- Connection optimization
SET GLOBAL max_connections = 200;
SET GLOBAL wait_timeout = 300;
```

### Application Optimization
```bash
# Connection pooling (already configured)
DB_CONNECTION_LIMIT=20
DB_QUEUE_LIMIT=0
DB_ACQUIRE_TIMEOUT=60000

# Enable compression
NODE_ENV=production
```

## 🆘 Troubleshooting

### Common Issues

**Connection Timeout**
```bash
# Check if MySQL server is running
mysql -h your-host -u your-user -p -e "SELECT 1;"

# Verify firewall rules
# Check security groups (AWS/DigitalOcean)
```

**Authentication Failed**
```bash
# Verify credentials
# Check user permissions
mysql -h your-host -u your-user -p -e "SHOW GRANTS;"
```

**Database Not Found**
```bash
# Create database manually
mysql -h your-host -u your-user -p -e "
CREATE DATABASE droguerie_jamal_prod
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"
```

**Migration Errors**
```bash
# Check table creation permissions
# Verify database character set
# Check existing table structures
```

## 📞 Support Resources

- **PlanetScale Docs**: https://docs.planetscale.com
- **Railway Docs**: https://docs.railway.app
- **DigitalOcean Docs**: https://docs.digitalocean.com/products/databases/
- **AWS RDS Docs**: https://docs.aws.amazon.com/rds/

## ✅ Production Deployment Checklist

- [ ] MySQL database created and configured
- [ ] Environment variables updated with production values
- [ ] Database migration completed successfully
- [ ] Sample data seeded (or real data imported)
- [ ] Admin user created and tested
- [ ] Application connection verified
- [ ] All features tested in production environment
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] SSL certificates installed
- [ ] Domain and DNS configured
