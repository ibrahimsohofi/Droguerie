# 🔨 Droguerie Jamal - Hardware & DIY Store E-commerce Platform

> **Professional e-commerce solution for hardware, construction, and home improvement businesses in Morocco**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18%2B-green.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.6-blue.svg)

## 🏪 About Droguerie Jamal

Droguerie Jamal is a comprehensive e-commerce platform specifically designed for hardware and DIY stores in Morocco. The platform supports businesses that sell construction materials, tools, plumbing supplies, electrical components, paints, and other home improvement products.

### 🛠️ Business Categories

Our platform supports the following product categories common to Moroccan hardware stores:

- **🧪 Droguerie** - Hardware supplies, chemicals, adhesives, sealants
- **🚿 Sanitaire** - Plumbing fixtures, pipes, faucets, water heaters, bathroom accessories
- **🎨 Peinture** - Paints, primers, brushes, rollers, painting accessories
- **🔩 Quincaillerie** - Hardware fasteners, screws, bolts, nuts, hinges, locks
- **🔨 Outillage** - Hand tools, power tools, measuring equipment, safety gear
- **⚡ Électricité** - Electrical components, wiring, switches, outlets, lighting

### 📦 Product Examples

- Water heaters and boilers
- Faucets and shower heads
- PVC and metal pipes
- Power drills and hand tools
- Interior and exterior paints
- Electrical cables and components
- Construction adhesives
- Safety equipment

## ✨ Platform Features

### 🛒 E-commerce Core
- **Product Catalog** - Comprehensive inventory management
- **Shopping Cart** - Multi-item cart with quantity controls
- **Secure Checkout** - Multiple payment options including cash on delivery
- **Order Management** - Real-time order tracking and status updates
- **User Accounts** - Customer profiles with order history

### 🌍 Morocco-Specific Features
- **Multi-language Support** - Arabic (RTL), French, and English
- **Local Payment Methods** - Bank transfer, cash on delivery, mobile payments
- **Moroccan Dirham (MAD)** - Native currency support
- **WhatsApp Business Integration** - Customer support and order notifications
- **Prayer Times Widget** - Islamic prayer times for major Moroccan cities

### 👨‍💼 Business Management
- **Admin Dashboard** - Complete business analytics and reporting
- **Inventory Management** - Stock tracking, low inventory alerts
- **Order Processing** - Streamlined order fulfillment workflow
- **Customer Management** - Customer database and communication tools
- **Coupon System** - Promotional codes and discount management

### 📱 Technical Features
- **Responsive Design** - Mobile-first approach for all devices
- **Progressive Web App (PWA)** - App-like experience on mobile
- **SEO Optimized** - Search engine friendly structure
- **Fast Loading** - Optimized performance with Vite
- **Offline Support** - Basic functionality without internet

## 🛠️ Technology Stack

### Frontend
- **React 18.3** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite/MySQL** - Database options
- **JWT Authentication** - Secure user sessions
- **Stripe Integration** - Payment processing

### DevOps & Tools
- **Bun** - Fast package manager and runtime
- **Biome** - Code formatting and linting
- **Git** - Version control
- **Railway/Netlify** - Deployment platforms

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Bun package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahimsohofi/Droguerie.git
   cd Droguerie
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client && bun install

   # Install server dependencies
   cd ../server && bun install
   ```

3. **Start development servers**
   ```bash
   # Start backend server (Terminal 1)
   cd server && bun run dev

   # Start frontend server (Terminal 2)
   cd client && bun run dev
   ```

4. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **Admin Panel**: http://localhost:5173/admin

### Default Admin Access
- **Email**: admin@drogueriejamal.ma
- **Password**: admin123

## 📋 Database Setup

The platform comes pre-configured with sample data including:

- **12 Product Categories** - All major hardware store categories
- **29 Sample Products** - Representative items from each category
- **Admin User** - Ready-to-use administrative account
- **Sample Data** - Categories and products for immediate testing

### Sample Categories Created
- Cleaning Products → Droguerie (Hardware/Chemicals)
- Personal Care → Sanitaire (Plumbing/Sanitary)
- Bath Products → Sanitaire (Plumbing/Sanitary)
- Hardware & Tools → Quincaillerie & Outillage
- Electronics & Batteries → Électricité
- And more...

## 🏗️ Project Structure

```
Droguerie/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend API
│   ├── controllers/       # API route handlers
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   ├── middleware/       # Custom middleware
│   └── package.json      # Backend dependencies
├── scripts/              # Deployment and setup scripts
└── README.md            # This file
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Admin Endpoints
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/analytics` - Business analytics

## 🎨 Customization

### Branding
- Update `client/public/manifest.json` for PWA settings
- Replace logos in `client/public/icons/`
- Modify color scheme in `client/tailwind.config.js`

### Business Configuration
- Update business details in `server/.env`
- Configure payment methods in payment controllers
- Customize email templates in `server/services/emailService.js`

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   cp server/.env.example server/.env.production
   # Edit .env.production with your production values
   ```

2. **Build for Production**
   ```bash
   cd client && bun run build
   ```

3. **Deploy to Railway/Netlify**
   - Frontend: Deploy `client/dist` folder to Netlify
   - Backend: Deploy server folder to Railway
   - Update CORS origins in production environment

### Environment Variables

Key environment variables to configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret

# Database
DATABASE_URL=./database.sqlite

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password

# Payment Processing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Business Details
BUSINESS_NAME=Droguerie Jamal
BUSINESS_EMAIL=contact@drogueriejamal.ma
BUSINESS_PHONE=+212 522 123 456
```

## 📞 Support & Contact

For technical support or business inquiries:

- **Email**: contact@drogueriejamal.ma
- **Phone**: +212 522 123 456
- **WhatsApp**: Business integration available
- **Address**: Morocco (Update with actual address)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Roadmap

### Upcoming Features
- [ ] Inventory management with supplier integration
- [ ] Bulk order discounts for contractors
- [ ] Product comparison tools
- [ ] Advanced search with technical specifications
- [ ] Mobile app development
- [ ] Multi-store management
- [ ] Integration with local suppliers

---

**Built with ❤️ for Moroccan hardware businesses**
