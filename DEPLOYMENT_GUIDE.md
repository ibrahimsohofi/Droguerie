# 🚀 Complete Deployment Guide - Droguerie Jamal E-commerce Platform

## Overview
This guide will help you deploy the complete full-stack Droguerie Jamal application with backend API and frontend integration.

## 📋 Pre-deployment Checklist

### ✅ Already Completed
- Frontend deployed to Netlify: https://same-zgj465002ro-latest.netlify.app
- Backend code prepared for deployment
- Database schema and seed data ready
- Production configuration files created

## 🚄 Phase 1: Deploy Backend to Railway

### Step 1: Railway Setup
1. Visit [Railway.app](https://railway.app) and create account
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repository
4. Choose "Deploy Now"

### Step 2: Configure Environment Variables
In Railway dashboard, go to Variables tab and add these:

```bash
# Core Configuration
NODE_ENV=production
DATABASE_TYPE=sqlite
FALLBACK_DATABASE_URL=./database.sqlite

# Security
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# Business Configuration
BUSINESS_NAME=Droguerie Jamal
BUSINESS_EMAIL=contact@drogueriejamal.ma
BUSINESS_PHONE=+212522123456
BUSINESS_ADDRESS=123 Rue Hassan II, Casablanca, Morocco

# Admin Access
ADMIN_EMAIL=admin@drogueriejamal.ma
ADMIN_PASSWORD=your_secure_admin_password

# CORS (Add your Netlify URL)
CORS_ORIGIN=https://same-zgj465002ro-latest.netlify.app
ALLOWED_ORIGINS=https://same-zgj465002ro-latest.netlify.app

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp
MAX_FILES_PER_UPLOAD=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Step 3: Deploy Configuration
1. In Railway, set **Start Command**: `npm start`
2. Set **Build Command**: `npm install && npm run seed:production`
3. Set **Health Check Path**: `/api/health`

### Step 4: Copy Your Railway URL
After deployment, Railway will provide a URL like: `https://your-app-name.railway.app`
**Copy this URL - you'll need it for the frontend configuration.**

## 🌐 Phase 2: Update Frontend Configuration

### Step 1: Update API URL
Replace `VITE_API_URL` in the frontend environment:

```bash
# In client/.env.production, update:
VITE_API_URL=https://your-railway-app-url.railway.app
```

### Step 2: Configure Payment Keys (Optional)
For production payments, update these in `client/.env.production`:

```bash
# Stripe (get from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key

# Google OAuth (get from https://console.cloud.google.com/)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Facebook OAuth (get from https://developers.facebook.com/)
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

## 🔄 Phase 3: Redeploy Frontend

### Step 1: Update Frontend Environment
```bash
cd client
# Update .env.production with your Railway backend URL
echo "VITE_API_URL=https://your-railway-app-url.railway.app" > .env.production
```

### Step 2: Rebuild and Deploy
```bash
# Build with new configuration
bun run build

# Create deployment package
mkdir -p output
zip -r9 output/output.zip dist
```

### Step 3: Deploy to Netlify
Use the deployment tool to redeploy the frontend with the updated configuration.

## 🔧 Phase 4: Production Configuration

### Backend Configuration (Railway)
1. **Database**: Automatically seeded with 29 products and 12 categories
2. **Admin Access**: admin@drogueriejamal.ma / your_secure_password
3. **API Health**: Check `https://your-railway-url.railway.app/api/health`

### Frontend Configuration (Netlify)
1. **PWA**: Already configured and working
2. **Multi-language**: Arabic/French/English support active
3. **Payment**: Stripe integration ready (test mode)

## 🧪 Phase 5: Testing Checklist

### Backend API Tests
- [ ] Health check: `GET /api/health`
- [ ] Products endpoint: `GET /api/products`
- [ ] Categories endpoint: `GET /api/categories`
- [ ] Admin login: `POST /api/auth/login`

### Frontend Tests
- [ ] Home page loads with products
- [ ] Language switching works
- [ ] Shopping cart functionality
- [ ] Admin panel access
- [ ] Mobile responsiveness
- [ ] PWA installation

### Full Integration Tests
- [ ] Product catalog displays correctly
- [ ] Add to cart works
- [ ] User registration/login
- [ ] Admin product management
- [ ] Payment flow (test mode)

## 🎯 Expected Results

### After Successful Deployment:
- **Frontend**: https://same-zgj465002ro-latest.netlify.app (fully functional)
- **Backend**: https://your-railway-app.railway.app (API operational)
- **Database**: SQLite with 29 products across 12 categories
- **Admin**: Full access to product and order management
- **Features**: Multi-language, PWA, payments, WhatsApp integration

## 🆘 Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure Railway URL is added to CORS_ORIGIN
2. **Database Not Found**: Railway should auto-seed on first deployment
3. **API Not Responding**: Check Railway logs for startup errors
4. **Payment Errors**: Verify Stripe keys are correctly configured

### Debug Commands:
```bash
# Check Railway logs
railway logs

# Test API locally
curl https://your-railway-url.railway.app/api/health

# Check frontend build
cd client && bun run build
```

## 📞 Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Ensure CORS configuration includes your frontend URL

## 🎉 Success!

Once deployed, you'll have a complete Moroccan e-commerce platform with:
- ✅ Multi-language support (Arabic RTL, French, English)
- ✅ Product catalog with 29 items across 12 categories
- ✅ Shopping cart and wishlist functionality
- ✅ Admin panel for product management
- ✅ Payment processing with Stripe
- ✅ WhatsApp Business integration
- ✅ Progressive Web App (PWA) capabilities
- ✅ Mobile-responsive design

Your Droguerie Jamal store is ready for business! 🏪
