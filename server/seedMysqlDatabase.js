const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'droguerie_user',
  password: process.env.DB_PASSWORD || 'droguerie_password123',
  database: process.env.DB_NAME || 'droguerie_jamal',
});

// Test connection
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.log('\n📋 Make sure MySQL is running and the database is set up:');
    console.log('   1. Install MySQL server');
    console.log('   2. Run: mysql -u root -p < setup-mysql.sql');
    console.log('   3. Update .env file with correct credentials');
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
});

// Promisify MySQL operations
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.execute(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Sample categories data with Arabic and French translations
const categories = [
  {
    name: 'Cleaning Products',
    name_ar: 'منتجات التنظيف',
    name_fr: 'Produits de nettoyage',
    description: 'All-purpose cleaners, detergents, and household cleaning supplies',
    description_ar: 'منظفات متعددة الأغراض ومنظفات ومستلزمات تنظيف منزلية',
    description_fr: 'Nettoyants tout usage, détergents et produits de nettoyage ménagers',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Personal Care',
    name_ar: 'العناية الشخصية',
    name_fr: 'Soins personnels',
    description: 'Hygiene products, toiletries, and personal care items',
    description_ar: 'منتجات النظافة ومستلزمات الحمام ومنتجات العناية الشخصية',
    description_fr: 'Produits d\'hygiène, articles de toilette et soins personnels',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Cosmetics & Beauty',
    name_ar: 'مستحضرات التجميل والجمال',
    name_fr: 'Cosmétiques et beauté',
    description: 'Makeup, skincare, and beauty products',
    description_ar: 'مكياج وعناية بالبشرة ومنتجات التجميل',
    description_fr: 'Maquillage, soins de la peau et produits de beauté',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Household Items',
    name_ar: 'أدوات منزلية',
    name_fr: 'Articles ménagers',
    description: 'Kitchen supplies, storage solutions, and household utilities',
    description_ar: 'مستلزمات المطبخ وحلول التخزين والمرافق المنزلية',
    description_fr: 'Fournitures de cuisine, solutions de rangement et utilitaires ménagers',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Bath Products',
    name_ar: 'منتجات الاستحمام',
    name_fr: 'Produits de bain',
    description: 'Soaps, shampoos, bath accessories, and towels',
    description_ar: 'صابون وشامبو واكسسوارات الحمام والمناشف',
    description_fr: 'Savons, shampoings, accessoires de bain et serviettes',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Hardware & Tools',
    name_ar: 'أدوات ومعدات',
    name_fr: 'Outils et équipements',
    description: 'Basic tools, hardware supplies, and maintenance items',
    description_ar: 'أدوات أساسية ومستلزمات معدنية ومنتجات الصيانة',
    description_fr: 'Outils de base, fournitures de quincaillerie et articles d\'entretien',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Health & Medicine',
    name_ar: 'الصحة والدواء',
    name_fr: 'Santé et médecine',
    description: 'Basic health products, first aid, and wellness items',
    description_ar: 'منتجات صحية أساسية والإسعافات الأولية ومنتجات الصحة',
    description_fr: 'Produits de santé de base, premiers secours et articles de bien-être',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Baby Products',
    name_ar: 'منتجات الأطفال',
    name_fr: 'Produits pour bébés',
    description: 'Baby care essentials, diapers, and infant supplies',
    description_ar: 'أساسيات العناية بالطفل والحفاضات ومستلزمات الرضع',
    description_fr: 'Soins essentiels pour bébé, couches et fournitures pour nourrissons',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Laundry & Fabric Care',
    name_ar: 'الغسيل والعناية بالأقمشة',
    name_fr: 'Lessive et entretien des tissus',
    description: 'Detergents, fabric softeners, and laundry accessories',
    description_ar: 'منظفات ومنعمات الأقمشة واكسسوارات الغسيل',
    description_fr: 'Détergents, assouplissants et accessoires de lessive',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Kitchen Supplies',
    name_ar: 'مستلزمات المطبخ',
    name_fr: 'Fournitures de cuisine',
    description: 'Cooking utensils, storage containers, and kitchen accessories',
    description_ar: 'أدوات الطبخ وحاويات التخزين واكسسوارات المطبخ',
    description_fr: 'Ustensiles de cuisine, contenants de stockage et accessoires de cuisine',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'Electronics & Batteries',
    name_ar: 'الإلكترونيات والبطاريات',
    name_fr: 'Électronique et piles',
    description: 'Batteries, small electronics, and electrical accessories',
    description_ar: 'بطاريات والإلكترونيات الصغيرة والاكسسوارات الكهربائية',
    description_fr: 'Piles, petits appareils électroniques et accessoires électriques',
    image_url: '/placeholder-category.jpg'
  },
  {
    name: 'School & Office',
    name_ar: 'المدرسة والمكتب',
    name_fr: 'École et bureau',
    description: 'Stationery, office supplies, and school materials',
    description_ar: 'قرطاسية ومستلزمات المكتب والمواد المدرسية',
    description_fr: 'Papeterie, fournitures de bureau et matériel scolaire',
    image_url: '/placeholder-category.jpg'
  }
];

// Sample products data
const products = [
  // Cleaning Products
  { name: 'Ariel Detergent Powder 3kg', name_ar: 'مسحوق غسيل أريال 3 كيلو', name_fr: 'Poudre détergente Ariel 3kg', description: 'Powerful laundry detergent for all fabric types', price: 89.99, category_id: 1, stock_quantity: 50, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Ajax Floor Cleaner 1L', name_ar: 'منظف الأرضيات أجاكس 1 لتر', name_fr: 'Nettoyant sol Ajax 1L', description: 'Multi-surface floor cleaner with fresh scent', price: 25.50, category_id: 1, stock_quantity: 75, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Javex Bleach 2L', name_ar: 'مبيض جافيكس 2 لتر', name_fr: 'Eau de Javel Javex 2L', description: 'Powerful bleach for whitening and disinfecting', price: 18.75, category_id: 1, stock_quantity: 60, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Glass Cleaner Spray 500ml', name_ar: 'رذاذ منظف الزجاج 500 مل', name_fr: 'Spray nettoyant vitres 500ml', description: 'Streak-free glass and mirror cleaner', price: 15.99, category_id: 1, stock_quantity: 40, image_url: '/api/placeholder/300x200.jpg' },

  // Personal Care
  { name: 'Dove Beauty Bar 90g', name_ar: 'صابون دوف للجمال 90 جرام', name_fr: 'Pain de beauté Dove 90g', description: 'Moisturizing beauty bar with ¼ moisturizing cream', price: 12.50, category_id: 2, stock_quantity: 100, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Head & Shoulders Shampoo 400ml', name_ar: 'شامبو هيد اند شولدرز 400 مل', name_fr: 'Shampooing Head & Shoulders 400ml', description: 'Anti-dandruff shampoo for healthy scalp', price: 45.00, category_id: 2, stock_quantity: 80, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Colgate Total Toothpaste 100ml', name_ar: 'معجون أسنان كولجيت توتال 100 مل', name_fr: 'Dentifrice Colgate Total 100ml', description: '12-hour protection for whole mouth health', price: 22.99, category_id: 2, stock_quantity: 120, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Oral-B Toothbrush Medium', name_ar: 'فرشاة أسنان أورال-بي متوسطة', name_fr: 'Brosse à dents Oral-B moyenne', description: 'Medium bristle toothbrush for effective cleaning', price: 8.99, category_id: 2, stock_quantity: 150, image_url: '/api/placeholder/300x200.jpg' },

  // Cosmetics & Beauty
  { name: 'L\'Oréal Face Cream 50ml', name_ar: 'كريم الوجه لوريال 50 مل', name_fr: 'Crème visage L\'Oréal 50ml', description: 'Anti-aging face cream with vitamin C', price: 89.99, category_id: 3, stock_quantity: 35, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Nivea Hand Cream 100ml', name_ar: 'كريم اليدين نيفيا 100 مل', name_fr: 'Crème mains Nivea 100ml', description: 'Moisturizing hand cream for soft hands', price: 28.50, category_id: 3, stock_quantity: 90, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Maybelline Mascara', name_ar: 'ماسكارا مايبيلين', name_fr: 'Mascara Maybelline', description: 'Volumizing mascara for dramatic lashes', price: 65.00, category_id: 3, stock_quantity: 25, image_url: '/api/placeholder/300x200.jpg' },

  // Household Items
  { name: 'Plastic Storage Containers Set', name_ar: 'مجموعة حاويات تخزين بلاستيكية', name_fr: 'Ensemble de contenants de stockage en plastique', description: 'Set of 5 airtight storage containers', price: 125.00, category_id: 4, stock_quantity: 30, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Kitchen Sponges Pack (6 pieces)', name_ar: 'عبوة اسفنج المطبخ (6 قطع)', name_fr: 'Pack d\'éponges cuisine (6 pièces)', description: 'Non-scratch sponges for dishes and surfaces', price: 18.99, category_id: 4, stock_quantity: 200, image_url: '/api/placeholder/300x200.jpg' },

  // Bath Products
  { name: 'Cotton Bath Towels Set', name_ar: 'مجموعة مناشف حمام قطنية', name_fr: 'Ensemble de serviettes de bain en coton', description: 'Soft and absorbent 100% cotton towels', price: 89.99, category_id: 5, stock_quantity: 45, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Shower Gel Vanilla 500ml', name_ar: 'جل الاستحمام بالفانيلا 500 مل', name_fr: 'Gel douche vanille 500ml', description: 'Moisturizing shower gel with vanilla scent', price: 32.50, category_id: 5, stock_quantity: 70, image_url: '/api/placeholder/300x200.jpg' },

  // Hardware & Tools
  { name: 'Multi-purpose Screwdriver Set', name_ar: 'مجموعة مفكات متعددة الأغراض', name_fr: 'Ensemble de tournevis polyvalents', description: 'Set of 8 screwdrivers for various tasks', price: 45.00, category_id: 6, stock_quantity: 25, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'LED Flashlight', name_ar: 'مصباح يدوي LED', name_fr: 'Lampe de poche LED', description: 'Bright LED flashlight with long battery life', price: 35.99, category_id: 6, stock_quantity: 40, image_url: '/api/placeholder/300x200.jpg' },

  // Health & Medicine
  { name: 'Digital Thermometer', name_ar: 'ترمومتر رقمي', name_fr: 'Thermomètre numérique', description: 'Fast and accurate digital thermometer', price: 55.00, category_id: 7, stock_quantity: 50, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'First Aid Kit', name_ar: 'حقيبة إسعافات أولية', name_fr: 'Trousse de premiers secours', description: 'Complete first aid kit for home and travel', price: 99.99, category_id: 7, stock_quantity: 20, image_url: '/api/placeholder/300x200.jpg' },

  // Baby Products
  { name: 'Baby Diapers Size 3 (40 pieces)', name_ar: 'حفاضات أطفال مقاس 3 (40 قطعة)', name_fr: 'Couches bébé taille 3 (40 pièces)', description: 'Ultra-absorbent diapers for comfort and protection', price: 149.99, category_id: 8, stock_quantity: 60, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Baby Shampoo 200ml', name_ar: 'شامبو الأطفال 200 مل', name_fr: 'Shampooing bébé 200ml', description: 'Gentle, tear-free baby shampoo', price: 28.99, category_id: 8, stock_quantity: 85, image_url: '/api/placeholder/300x200.jpg' },

  // Laundry & Fabric Care
  { name: 'Fabric Softener 2L', name_ar: 'منعم الأقمشة 2 لتر', name_fr: 'Assouplissant 2L', description: 'Fabric softener for soft and fresh laundry', price: 42.50, category_id: 9, stock_quantity: 55, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Stain Remover Spray 300ml', name_ar: 'رذاذ إزالة البقع 300 مل', name_fr: 'Spray détachant 300ml', description: 'Powerful stain remover for tough stains', price: 25.99, category_id: 9, stock_quantity: 40, image_url: '/api/placeholder/300x200.jpg' },

  // Kitchen Supplies
  { name: 'Aluminum Foil Roll 30m', name_ar: 'لفافة ورق الألمنيوم 30 متر', name_fr: 'Rouleau papier aluminium 30m', description: 'Heavy-duty aluminum foil for cooking and storage', price: 22.99, category_id: 10, stock_quantity: 100, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Plastic Wrap 200m', name_ar: 'غلاف بلاستيكي 200 متر', name_fr: 'Film plastique 200m', description: 'Cling film for food storage and preservation', price: 18.50, category_id: 10, stock_quantity: 80, image_url: '/api/placeholder/300x200.jpg' },

  // Electronics & Batteries
  { name: 'AA Batteries Pack (8 pieces)', name_ar: 'عبوة بطاريات AA (8 قطع)', name_fr: 'Pack piles AA (8 pièces)', description: 'Long-lasting alkaline AA batteries', price: 35.99, category_id: 11, stock_quantity: 120, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Extension Cord 3m', name_ar: 'سلك تمديد 3 متر', name_fr: 'Rallonge électrique 3m', description: 'Heavy-duty extension cord with multiple outlets', price: 45.00, category_id: 11, stock_quantity: 30, image_url: '/api/placeholder/300x200.jpg' },

  // School & Office
  { name: 'Notebook Set A4 (5 pieces)', name_ar: 'مجموعة دفاتر A4 (5 قطع)', name_fr: 'Ensemble cahiers A4 (5 pièces)', description: 'Ruled notebooks for school and office use', price: 25.99, category_id: 12, stock_quantity: 150, image_url: '/api/placeholder/300x200.jpg' },
  { name: 'Pen Set (10 pieces)', name_ar: 'مجموعة أقلام (10 قطع)', name_fr: 'Ensemble stylos (10 pièces)', description: 'Blue ink ballpoint pens for writing', price: 15.50, category_id: 12, stock_quantity: 200, image_url: '/api/placeholder/300x200.jpg' }
];

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting MySQL database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('DELETE FROM user_coupons');
    await query('DELETE FROM coupons');
    await query('DELETE FROM cart');
    await query('DELETE FROM reviews');
    await query('DELETE FROM order_items');
    await query('DELETE FROM orders');
    await query('DELETE FROM products');
    await query('DELETE FROM categories');
    await query('DELETE FROM users WHERE email != "admin@drogueriejamal.ma"');
    await query('SET FOREIGN_KEY_CHECKS = 1');

    // Seed categories
    console.log('📁 Seeding categories...');
    for (const category of categories) {
      await query(
        `INSERT INTO categories (name, name_ar, name_fr, description, description_ar, description_fr, image_url, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
        [category.name, category.name_ar, category.name_fr, category.description, category.description_ar, category.description_fr, category.image_url]
      );
      console.log(`  ✅ Created category: ${category.name}`);
    }

    // Seed products
    console.log('📦 Seeding products...');
    for (const product of products) {
      await query(
        `INSERT INTO products (name, name_ar, name_fr, description, price, category_id, image_url, stock_quantity, is_active, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, FALSE)`,
        [product.name, product.name_ar, product.name_fr, product.description, product.price, product.category_id, product.image_url, product.stock_quantity]
      );
      console.log(`  ✅ Created product: ${product.name}`);
    }

    // Create admin user if doesn't exist
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    try {
      await query(
        `INSERT INTO users (name, email, password, role, status, email_verified)
         VALUES (?, ?, ?, 'admin', 'active', TRUE)`,
        ['Admin User', 'admin@drogueriejamal.ma', hashedPassword]
      );
      console.log('  ✅ Created admin user: admin@drogueriejamal.ma');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('  ℹ️  Admin user already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 MySQL database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Products: ${products.length}`);
    console.log('  - Admin user: admin@drogueriejamal.ma (password: admin123)');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    connection.end();
  }
};

// Run the seeding
seedDatabase();
