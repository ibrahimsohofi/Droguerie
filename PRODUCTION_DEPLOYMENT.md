# 🚀 Production Deployment Guide - Droguerie Jamal

## 📋 **Pre-Deployment Checklist**

### ✅ **1. Environment Configuration**
- [ ] Update `.env` files with production values
- [ ] Configure live Stripe API keys
- [ ] Set up production email service (Gmail/SendGrid)
- [ ] Generate secure JWT secrets
- [ ] Configure production domain URLs

### ✅ **2. Security Setup**
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS for production domains
- [ ] Set up proper rate limiting
- [ ] Review security headers (Helmet.js)
- [ ] Secure admin credentials

---

## 🌐 **Custom Domain Setup**

### **Option A: Netlify Custom Domain (Frontend)**

1. **Purchase Domain**
   - Buy `drogueriejamal.ma` or `drogueriejamal.com`
   - Use providers: Namecheap, GoDaddy, OVH (Morocco)

2. **Configure Netlify**
   ```bash
   # In Netlify dashboard:
   1. Go to Site Settings > Domain management
   2. Click "Add custom domain"
   3. Enter: drogueriejamal.ma
   4. Follow DNS configuration instructions
   ```

3. **DNS Configuration**
   ```dns
   # Add these DNS records at your domain provider:
   Type: CNAME
   Name: www
   Value: your-netlify-site.netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)
   ```

4. **SSL Certificate**
   - Netlify automatically provides free SSL certificates
   - Verify HTTPS is working after DNS propagation

### **Option B: Custom Hosting with Cloudflare**

1. **Setup Cloudflare**
   ```bash
   1. Add site to Cloudflare
   2. Update nameservers at domain registrar
   3. Configure DNS records
   4. Enable SSL/TLS (Full mode)
   ```

2. **DNS Records**
   ```dns
   A    @         YOUR_SERVER_IP
   A    www       YOUR_SERVER_IP
   CNAME api     your-backend-domain.com
   ```

---

## 🖥️ **Backend Deployment Options**

### **Option A: Railway (Recommended)**

1. **Setup Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Environment Variables**
   ```bash
   # Add to Railway dashboard:
   NODE_ENV=production
   DATABASE_URL=./database.sqlite
   JWT_SECRET=your-production-jwt-secret
   STRIPE_SECRET_KEY=sk_live_...
   SMTP_USER=contact@drogueriejamal.ma
   SMTP_PASS=your-app-password
   ```

3. **Custom Domain**
   ```bash
   # In Railway dashboard:
   1. Go to Settings > Domains
   2. Add custom domain: api.drogueriejamal.ma
   3. Configure DNS CNAME record
   ```

### **Option B: DigitalOcean App Platform**

1. **Create App**
   ```yaml
   # app.yaml
   name: droguerie-jamal-api
   services:
   - name: api
     source_dir: /server
     github:
       repo: yourusername/Droguerie
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

2. **Environment Variables**
   - Configure in DigitalOcean dashboard
   - Add all production environment variables

### **Option C: Render**

1. **Connect Repository**
   ```bash
   1. Go to render.com
   2. Connect GitHub repository
   3. Select server folder
   4. Configure build and start commands
   ```

2. **Configuration**
   ```bash
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

---

## 💳 **Stripe Production Setup**

### **1. Activate Live Mode**

1. **Get Live API Keys**
   ```bash
   1. Go to https://dashboard.stripe.com/apikeys
   2. Switch to "Live" mode (toggle in left sidebar)
   3. Copy Publishable key (pk_live_...)
   4. Copy Secret key (sk_live_...)
   ```

2. **Update Environment Files**
   ```bash
   # server/.env
   STRIPE_SECRET_KEY=sk_live_51XXXXXXX...

   # client/.env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51XXXXXXX...
   ```

### **2. Configure Webhooks**

1. **Create Webhook Endpoint**
   ```bash
   1. Go to https://dashboard.stripe.com/webhooks
   2. Add endpoint: https://api.drogueriejamal.ma/api/payments/webhook
   3. Select events:
      - payment_intent.succeeded
      - payment_intent.payment_failed
      - customer.created
   ```

2. **Add Webhook Secret**
   ```bash
   # server/.env
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXX...
   ```

---

## 📧 **Email Service Setup**

### **Option A: Gmail with App Password**

1. **Enable 2FA on Gmail**
   ```bash
   1. Go to Google Account settings
   2. Enable 2-Factor Authentication
   ```

2. **Generate App Password**
   ```bash
   1. Go to Security > App passwords
   2. Generate password for "Mail"
   3. Use 16-character password in .env
   ```

3. **Configuration**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=contact@drogueriejamal.ma
   SMTP_PASS=your-16-char-app-password
   ```

### **Option B: SendGrid (Recommended for Production)**

1. **Setup SendGrid Account**
   ```bash
   1. Sign up at sendgrid.com
   2. Verify your domain
   3. Create API key
   ```

2. **Configuration**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

---

## 🔒 **Security Configuration**

### **1. SSL/HTTPS Setup**

```bash
# Automatic with Netlify/Railway
# Manual setup with Let's Encrypt:
sudo certbot --nginx -d drogueriejamal.ma -d www.drogueriejamal.ma
```

### **2. Environment Security**

```bash
# Generate secure JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Strong admin password:
ADMIN_PASSWORD=Complex123!@#SecurePassword456$%^
```

### **3. Database Security**

```bash
# For production, consider PostgreSQL:
DATABASE_URL=postgresql://user:password@host:5432/droguerie_jamal

# Regular backups:
pg_dump droguerie_jamal > backup_$(date +%Y%m%d).sql
```

---

## 📊 **Monitoring & Analytics**

### **1. Error Tracking with Sentry**

```bash
# Install Sentry
npm install @sentry/node

# Configure in server/index.js:
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### **2. Google Analytics**

```html
<!-- Add to client/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### **3. Uptime Monitoring**

- **UptimeRobot**: Free monitoring service
- **Pingdom**: Advanced monitoring features
- **StatusCake**: Alternative monitoring option

---

## 🚀 **Deployment Commands**

### **Frontend Deployment**

```bash
# Build for production
cd client
bun run build

# Deploy to Netlify (automatic with git push)
# Or manual deploy:
netlify deploy --prod --dir=dist
```

### **Backend Deployment**

```bash
# Railway
railway up

# Manual server
pm2 start server/index.js --name droguerie-api
pm2 save
pm2 startup
```

---

## ✅ **Post-Deployment Verification**

### **1. Test Checklist**

- [ ] Website loads on custom domain
- [ ] HTTPS is working
- [ ] API endpoints respond correctly
- [ ] Stripe payments work (test mode first)
- [ ] Email notifications send successfully
- [ ] Admin panel accessible
- [ ] Database operations work
- [ ] Mobile responsiveness verified

### **2. Performance Optimization**

```bash
# Enable gzip compression
# Configure CDN (Cloudflare)
# Optimize images
# Minify CSS/JS (automatic with Vite)
```

---

## 🆘 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   ```bash
   # Update CORS_ORIGIN in server/.env
   CORS_ORIGIN=https://drogueriejamal.ma
   ```

2. **Database Connection Issues**
   ```bash
   # Check DATABASE_URL path
   # Ensure proper permissions
   # Verify backup strategy
   ```

3. **Stripe Webhook Failures**
   ```bash
   # Verify endpoint URL
   # Check webhook secret
   # Review event selection
   ```

---

## 📞 **Support Contacts**

- **Domain Issues**: Contact domain registrar
- **Hosting**: Railway/Netlify support
- **Payments**: Stripe support
- **Email**: Gmail/SendGrid support

---

## 📈 **Scaling Considerations**

### **When to Scale**

- High traffic volumes
- Database performance issues
- Need for multiple regions
- Advanced features requirements

### **Scaling Options**

- **Database**: PostgreSQL cluster
- **Backend**: Load balancing
- **CDN**: Global content delivery
- **Caching**: Redis implementation
