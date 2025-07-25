const { db } = require('./config/db');
const bcrypt = require('bcryptjs');

// Seed data
const categories = [
  { name: 'Cleaning Products', name_ar: 'منتجات التنظيف', description: 'Household cleaning supplies and detergents' },
  { name: 'Personal Care', name_ar: 'العناية الشخصية', description: 'Toiletries and personal hygiene products' },
  { name: 'Cosmetics & Beauty', name_ar: 'مستحضرات التجميل والجمال', description: 'Beauty and cosmetic products' },
  { name: 'Household Items', name_ar: 'أدوات منزلية', description: 'General household utilities and supplies' },
  { name: 'Bath Products', name_ar: 'منتجات الحمام', description: 'Bath towels, accessories and bathroom supplies' },
  { name: 'Hardware & Tools', name_ar: 'أدوات ومعدات', description: 'Basic tools and hardware items' },
  { name: 'Health & Medicine', name_ar: 'الصحة والدواء', description: 'Basic healthcare and medical supplies' },
  { name: 'Baby Products', name_ar: 'منتجات الأطفال', description: 'Baby care and infant products' },
  { name: 'Laundry & Fabric Care', name_ar: 'الغسيل وعناية الأقمشة', description: 'Laundry detergents and fabric care products' },
  { name: 'Kitchen Supplies', name_ar: 'لوازم المطبخ', description: 'Kitchen utensils and cooking supplies' }
];

const products = [
  { name: 'Dish Soap', name_ar: 'صابون الأطباق', description: 'Effective dish cleaning liquid', price: 15.99, category_id: 1, stock_quantity: 100, image_url: '/assets/images/product_1_photo-1513475382585-d06e58bcb0e0.jpg' },
  { name: 'Hand Soap', name_ar: 'صابون اليدين', description: 'Gentle hand washing soap', price: 8.50, category_id: 2, stock_quantity: 150, image_url: '/assets/images/product_2_photo-1544367567-0f2fcb009e0b.jpg' },
  { name: 'Shampoo', name_ar: 'شامبو', description: 'Nourishing hair shampoo', price: 25.00, category_id: 2, stock_quantity: 80, image_url: '/assets/images/product_3_photo-1556228453-efd6c1ff04f6.jpg' },
  { name: 'Face Cream', name_ar: 'كريم الوجه', description: 'Moisturizing face cream', price: 45.00, category_id: 3, stock_quantity: 60, image_url: '/assets/images/product_4_photo-1556909114-f6e7ad7d3136.jpg' },
  { name: 'Toilet Paper', name_ar: 'ورق التواليت', description: 'Soft toilet tissue', price: 12.00, category_id: 4, stock_quantity: 200, image_url: '/assets/images/product_5_photo-1558618047-3c8c76ca7d13.jpg' },
  { name: 'Bath Towel', name_ar: 'منشفة الحمام', description: 'Absorbent bath towel', price: 35.00, category_id: 5, stock_quantity: 40, image_url: '/assets/images/product_6_photo-1559757148-5c350d0d3c56.jpg' },
  { name: 'Screwdriver Set', name_ar: 'طقم مفكات', description: 'Basic screwdriver toolkit', price: 55.00, category_id: 6, stock_quantity: 30, image_url: '/assets/images/product_7_photo-1571019613454-1cb2f99b2d8b.jpg' },
  { name: 'First Aid Kit', name_ar: 'حقيبة إسعافات أولية', description: 'Emergency first aid supplies', price: 75.00, category_id: 7, stock_quantity: 25, image_url: '/assets/images/product_8_photo-1572981779307-38b8cabb2407.jpg' },
  { name: 'Baby Diapers', name_ar: 'حفاضات الأطفال', description: 'Comfortable baby diapers', price: 40.00, category_id: 8, stock_quantity: 100, image_url: '/assets/images/product_9_photo-1576091160399-112ba8d25d1f.jpg' },
  { name: 'Laundry Detergent', name_ar: 'منظف الغسيل', description: 'Powerful laundry cleaning', price: 28.00, category_id: 9, stock_quantity: 90, image_url: '/assets/images/product_10_photo-1584464491033-06628f3a6b7b.jpg' }
];

const seedDatabase = async () => {
  return new Promise((resolve, reject) => {
    console.log('🌱 Starting SQLite database seeding...');

    db.serialize(async () => {
      try {
        // Clear existing data
        db.run('DELETE FROM products');
        db.run('DELETE FROM categories');
        db.run('DELETE FROM users');

        // Insert categories
        const categoryStmt = db.prepare('INSERT INTO categories (name, name_ar, description) VALUES (?, ?, ?)');
        categories.forEach(category => {
          categoryStmt.run(category.name, category.name_ar, category.description);
        });
        categoryStmt.finalize();
        console.log('✅ Categories seeded');

        // Insert products
        const productStmt = db.prepare('INSERT INTO products (name, name_ar, description, price, category_id, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
        products.forEach(product => {
          productStmt.run(product.name, product.name_ar, product.description, product.price, product.category_id, product.stock_quantity, product.image_url);
        });
        productStmt.finalize();
        console.log('✅ Products seeded');

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const userStmt = db.prepare('INSERT INTO users (email, password, first_name, last_name, is_admin, is_verified) VALUES (?, ?, ?, ?, ?, ?)');
        userStmt.run('admin@drogueriejamal.ma', hashedPassword, 'Admin', 'User', 1, 1);
        userStmt.finalize();
        console.log('✅ Admin user created (admin@drogueriejamal.ma / admin123)');

        // Create sample coupons
        const couponStmt = db.prepare('INSERT INTO coupons (code, type, value, minimum_amount, usage_limit) VALUES (?, ?, ?, ?, ?)');
        couponStmt.run('WELCOME10', 'percentage', 10, 50, 100);
        couponStmt.run('SAVE20', 'fixed', 20, 100, 50);
        couponStmt.finalize();
        console.log('✅ Sample coupons created');

        console.log('🎉 Database seeding completed successfully!');
        resolve();
      } catch (error) {
        console.error('❌ Error seeding database:', error);
        reject(error);
      }
    });
  });
};

// Run seeding
seedDatabase()
  .then(() => {
    console.log('✅ Seeding process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
