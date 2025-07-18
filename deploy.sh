#!/bin/bash

# =================================================================
# DROGUERIE JAMAL - DEPLOYMENT AUTOMATION SCRIPT
# =================================================================

echo "🚀 Starting Droguerie Jamal Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Railway URL is provided
if [ -z "$1" ]; then
    print_error "Usage: ./deploy.sh <railway-backend-url>"
    print_info "Example: ./deploy.sh https://your-app.railway.app"
    exit 1
fi

RAILWAY_URL="$1"
print_info "Backend URL: $RAILWAY_URL"

# =================================================================
# PHASE 1: PREPARE BACKEND FOR RAILWAY
# =================================================================
echo ""
echo "📦 Phase 1: Preparing Backend for Railway..."

cd server

# Create production environment file
print_info "Creating Railway environment configuration..."
cat > .env.production << EOF
NODE_ENV=production
PORT=\${{RAILWAY_PORT}}
API_BASE_URL=$RAILWAY_URL
DATABASE_TYPE=sqlite
FALLBACK_DATABASE_URL=./database.sqlite
JWT_SECRET=droguerie_jamal_railway_jwt_secret_$(date +%s)
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=droguerie_jamal_railway_refresh_secret_$(date +%s)
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=$RAILWAY_URL,https://same-zgj465002ro-latest.netlify.app
ALLOWED_ORIGINS=$RAILWAY_URL,https://same-zgj465002ro-latest.netlify.app
BUSINESS_NAME=Droguerie Jamal
BUSINESS_EMAIL=contact@drogueriejamal.ma
BUSINESS_PHONE=+212522123456
BUSINESS_ADDRESS=123 Rue Hassan II, Casablanca, Morocco
BUSINESS_HOURS=Mon-Sat: 8:00-20:00, Sun: 9:00-18:00
ADMIN_EMAIL=admin@drogueriejamal.ma
ADMIN_PASSWORD=admin123_change_in_production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@drogueriejamal.ma
SMTP_PASS=your_gmail_app_password
SMTP_FROM=Droguerie Jamal <contact@drogueriejamal.ma>
STRIPE_SECRET_KEY=sk_test_your_stripe_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,webp
MAX_FILES_PER_UPLOAD=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
EOF

print_status "Backend environment configured for Railway"

# =================================================================
# PHASE 2: UPDATE FRONTEND CONFIGURATION
# =================================================================
echo ""
echo "🌐 Phase 2: Updating Frontend Configuration..."

cd ../client

# Update frontend environment with Railway backend URL
print_info "Updating frontend API configuration..."
cat > .env.production << EOF
# Backend API URL (Updated with Railway deployment)
VITE_API_URL=$RAILWAY_URL

# Stripe Payment Configuration (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key

# OAuth Configuration (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# App Configuration
VITE_APP_NAME="دروغيري جمال - Droguerie Jamal"
VITE_APP_DESCRIPTION="دروغيريتك المحلية الموثوقة - Your trusted neighborhood droguerie"
VITE_APP_VERSION=1.0.0

# Business Contact
VITE_BUSINESS_PHONE="+212522123456"
VITE_BUSINESS_EMAIL="contact@drogueriejamal.ma"
VITE_BUSINESS_ADDRESS="123 Rue Hassan II, Casablanca, Morocco"

# WhatsApp Business
VITE_WHATSAPP_NUMBER="+212522123456"
VITE_WHATSAPP_MESSAGE="مرحبا، أريد الاستفسار عن المنتجات - Hello, I want to inquire about products"
EOF

print_status "Frontend configuration updated with backend URL"

# =================================================================
# PHASE 3: BUILD FRONTEND FOR DEPLOYMENT
# =================================================================
echo ""
echo "🔨 Phase 3: Building Frontend for Production..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    bun install
fi

# Build production version
print_info "Building production frontend..."
bun run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Create deployment package
print_info "Creating deployment package..."
mkdir -p output
cd dist
zip -r9 ../output/output.zip . > /dev/null 2>&1
cd ..

if [ -f "output/output.zip" ]; then
    print_status "Deployment package created: client/output/output.zip"
else
    print_error "Failed to create deployment package"
    exit 1
fi

# =================================================================
# PHASE 4: DEPLOYMENT INSTRUCTIONS
# =================================================================
echo ""
echo "📋 Phase 4: Deployment Instructions"
echo "=================================="

print_info "BACKEND DEPLOYMENT (Railway):"
echo "1. Visit https://railway.app and create a new project"
echo "2. Connect your GitHub repository"
echo "3. Deploy the 'server' folder"
echo "4. Add the environment variables from server/.env.production"
echo "5. Set start command: 'npm start'"
echo "6. Set build command: 'npm install && npm run seed:production'"

echo ""
print_info "FRONTEND DEPLOYMENT (Netlify):"
echo "1. The frontend package is ready: client/output/output.zip"
echo "2. Upload this to Netlify or use the deployment tool"
echo "3. The frontend is configured to connect to: $RAILWAY_URL"

echo ""
print_info "TESTING CHECKLIST:"
echo "✓ Backend health: curl $RAILWAY_URL/api/health"
echo "✓ Products API: curl $RAILWAY_URL/api/products"
echo "✓ Frontend loads with products from backend"
echo "✓ Admin panel: admin@drogueriejamal.ma / admin123_change_in_production"

echo ""
print_status "Deployment preparation complete!"
print_warning "Remember to:"
echo "  - Deploy server folder to Railway with provided environment variables"
echo "  - Deploy client/output/output.zip to Netlify"
echo "  - Test the full application functionality"
echo "  - Change admin password in production"
echo "  - Configure real payment keys when ready"

echo ""
echo "🎉 Your Droguerie Jamal e-commerce platform is ready for deployment!"
