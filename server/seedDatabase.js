const { initializeDatabase } = require('./config/db');

// Comprehensive categories for a Moroccan droguerie
const categories = [
  {
    name: 'Cleaning Products',
    name_ar: 'منتجات التنظيف',
    description: 'Household cleaning supplies and detergents'
  },
  {
    name: 'Personal Care',
    name_ar: 'العناية الشخصية',
    description: 'Toiletries and personal hygiene products'
  },
  {
    name: 'Cosmetics & Beauty',
    name_ar: 'مستحضرات التجميل والجمال',
    description: 'Beauty and cosmetic products for all skin types'
  },
  {
    name: 'Household Items',
    name_ar: 'أدوات منزلية',
    description: 'General household utilities and supplies'
  },
  {
    name: 'Bath Products',
    name_ar: 'منتجات الحمام',
    description: 'Bath towels, accessories and bathroom supplies'
  },
  {
    name: 'Hardware & Tools',
    name_ar: 'أدوات ومعدات',
    description: 'Basic tools and hardware items'
  },
  {
    name: 'Health & Medicine',
    name_ar: 'الصحة والدواء',
    description: 'Basic healthcare and medical supplies'
  },
  {
    name: 'Baby Products',
    name_ar: 'منتجات الأطفال',
    description: 'Baby care and infant products'
  },
  {
    name: 'Laundry & Fabric Care',
    name_ar: 'الغسيل وعناية الأقمشة',
    description: 'Laundry detergents and fabric care products'
  },
  {
    name: 'Kitchen Supplies',
    name_ar: 'لوازم المطبخ',
    description: 'Kitchen utensils and cooking supplies'
  },
  {
    name: 'Electronics & Batteries',
    name_ar: 'الإلكترونيات والبطاريات',
    description: 'Basic electronics and battery supplies'
  },
  {
    name: 'School & Office',
    name_ar: 'المدرسة والمكتب',
    description: 'School and office supplies'
  }
];

// Comprehensive products for a Moroccan droguerie
const products = [
  // Cleaning Products (category_id: 1)
  {
    name: 'Ariel Detergent Powder 3kg',
    name_ar: 'مسحوق أريال للغسيل 3 كيلو',
    description: 'High-quality washing powder for all fabrics. Removes tough stains effectively.',
    description_ar: 'مسحوق غسيل عالي الجودة لجميع الأقمشة. يزيل البقع الصعبة بفعالية.',
    price: 49.99,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock_quantity: 50,
    is_active: true
  },
  {
    name: 'Ajax Floor Cleaner 1L',
    name_ar: 'منظف الأرضيات أجاكس 1 لتر',
    description: 'Powerful floor cleaner that leaves floors spotless and fresh.',
    description_ar: 'منظف أرضيات قوي يترك الأرضيات نظيفة ومنعشة.',
    price: 15.50,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    stock_quantity: 75,
    is_active: true
  },
  {
    name: 'Javex Bleach 2L',
    name_ar: 'مبيض جافيكس 2 لتر',
    description: 'Strong bleach for disinfection and whitening.',
    description_ar: 'مبيض قوي للتطهير والتبييض.',
    price: 18.00,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
    stock_quantity: 40,
    is_active: true
  },
  {
    name: 'Glass Cleaner Spray 500ml',
    name_ar: 'رذاذ منظف الزجاج 500 مل',
    description: 'Crystal clear glass cleaner for windows and mirrors.',
    description_ar: 'منظف زجاج صافي للنوافذ والمرايا.',
    price: 12.75,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    stock_quantity: 60,
    is_active: true
  },

  // Personal Care (category_id: 2)
  {
    name: 'Dove Beauty Bar 90g',
    name_ar: 'صابون دوف للجمال 90 جرام',
    description: 'Moisturizing beauty bar with 1/4 moisturizing cream.',
    description_ar: 'صابون جمال مرطب مع ربع كريم مرطب.',
    price: 8.50,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
    stock_quantity: 100,
    is_active: true
  },
  {
    name: 'Head & Shoulders Shampoo 400ml',
    name_ar: 'شامبو هيد أند شولدرز 400 مل',
    description: 'Anti-dandruff shampoo for healthy scalp and hair.',
    description_ar: 'شامبو مضاد للقشرة لفروة رأس وشعر صحي.',
    price: 32.00,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    stock_quantity: 80,
    is_active: true
  },
  {
    name: 'Colgate Total Toothpaste 100ml',
    name_ar: 'معجون أسنان كولجيت توتال 100 مل',
    description: '12-hour protection against germs and plaque.',
    description_ar: 'حماية 12 ساعة ضد الجراثيم واللوحة.',
    price: 15.25,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    stock_quantity: 120,
    is_active: true
  },
  {
    name: 'Oral-B Toothbrush Medium',
    name_ar: 'فرشاة أسنان أورال بي متوسطة',
    description: 'Medium bristle toothbrush for effective cleaning.',
    description_ar: 'فرشاة أسنان بشعيرات متوسطة للتنظيف الفعال.',
    price: 12.00,
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1606787366850-de6ba128a8ec?w=400',
    stock_quantity: 90,
    is_active: true
  },

  // Cosmetics & Beauty (category_id: 3)
  {
    name: 'L\'Oréal Face Cream 50ml',
    name_ar: 'كريم الوجه لوريال 50 مل',
    description: 'Anti-aging face cream with hyaluronic acid.',
    description_ar: 'كريم وجه مضاد للشيخوخة مع حمض الهيالورونيك.',
    price: 85.00,
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400',
    stock_quantity: 45,
    is_active: true
  },
  {
    name: 'Nivea Hand Cream 100ml',
    name_ar: 'كريم اليدين نيفيا 100 مل',
    description: 'Intensive care hand cream for soft, smooth hands.',
    description_ar: 'كريم عناية مكثفة لليدين للحصول على يدين ناعمتين.',
    price: 22.50,
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    stock_quantity: 70,
    is_active: true
  },
  {
    name: 'Maybelline Mascara',
    name_ar: 'ماسكارا مايبلين',
    description: 'Volume express mascara for dramatic lashes.',
    description_ar: 'ماسكارا فوليوم إكسبريس للرموش الدرامية.',
    price: 45.00,
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    stock_quantity: 35,
    is_active: true
  },

  // Household Items (category_id: 4)
  {
    name: 'Plastic Storage Containers Set',
    name_ar: 'طقم حاويات تخزين بلاستيكية',
    description: 'Set of 5 airtight storage containers for kitchen organization.',
    description_ar: 'مجموعة من 5 حاويات تخزين محكمة الإغلاق لتنظيم المطبخ.',
    price: 65.00,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    stock_quantity: 30,
    is_active: true
  },
  {
    name: 'Kitchen Sponges Pack (6 pieces)',
    name_ar: 'عبوة إسفنج المطبخ (6 قطع)',
    description: 'Multi-purpose kitchen sponges for effective cleaning.',
    description_ar: 'إسفنج مطبخ متعدد الاستخدامات للتنظيف الفعال.',
    price: 18.00,
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
    stock_quantity: 85,
    is_active: true
  },

  // Bath Products (category_id: 5)
  {
    name: 'Cotton Bath Towels Set',
    name_ar: 'طقم مناشف حمام قطنية',
    description: 'Set of 3 soft cotton bath towels in assorted colors.',
    description_ar: 'طقم من 3 مناشف حمام قطنية ناعمة بألوان متنوعة.',
    price: 120.00,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    stock_quantity: 25,
    is_active: true
  },
  {
    name: 'Shower Gel Vanilla 500ml',
    name_ar: 'جل استحمام بالفانيليا 500 مل',
    description: 'Luxurious vanilla-scented shower gel for soft skin.',
    description_ar: 'جل استحمام فاخر برائحة الفانيليا للبشرة الناعمة.',
    price: 28.75,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock_quantity: 55,
    is_active: true
  },

  // Hardware & Tools (category_id: 6)
  {
    name: 'Multi-purpose Screwdriver Set',
    name_ar: 'طقم مفكات متعددة الاستخدامات',
    description: 'Essential screwdriver set with 8 different sizes.',
    description_ar: 'طقم مفكات أساسي بـ 8 أحجام مختلفة.',
    price: 45.00,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
    stock_quantity: 20,
    is_active: true
  },
  {
    name: 'LED Flashlight',
    name_ar: 'مصباح LED يدوي',
    description: 'Bright LED flashlight with long battery life.',
    description_ar: 'مصباح LED ساطع مع عمر بطارية طويل.',
    price: 35.00,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    stock_quantity: 40,
    is_active: true
  },

  // Health & Medicine (category_id: 7)
  {
    name: 'Digital Thermometer',
    name_ar: 'ميزان حرارة رقمي',
    description: 'Fast and accurate digital thermometer for fever monitoring.',
    description_ar: 'ميزان حرارة رقمي سريع ودقيق لمراقبة الحمى.',
    price: 65.00,
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    stock_quantity: 30,
    is_active: true
  },
  {
    name: 'First Aid Kit',
    name_ar: 'حقيبة الإسعافات الأولية',
    description: 'Complete first aid kit with essential medical supplies.',
    description_ar: 'حقيبة إسعافات أولية كاملة مع المستلزمات الطبية الأساسية.',
    price: 95.00,
    category_id: 7,
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
    stock_quantity: 15,
    is_active: true
  },

  // Baby Products (category_id: 8)
  {
    name: 'Baby Diapers Size 3 (40 pieces)',
    name_ar: 'حفاضات أطفال مقاس 3 (40 قطعة)',
    description: 'Ultra-soft baby diapers with 12-hour protection.',
    description_ar: 'حفاضات أطفال فائقة النعومة مع حماية 12 ساعة.',
    price: 55.00,
    category_id: 8,
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    stock_quantity: 45,
    is_active: true
  },
  {
    name: 'Baby Shampoo 200ml',
    name_ar: 'شامبو الأطفال 200 مل',
    description: 'Gentle, tear-free baby shampoo for delicate hair.',
    description_ar: 'شامبو أطفال لطيف وخالي من الدموع للشعر الرقيق.',
    price: 25.00,
    category_id: 8,
    image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
    stock_quantity: 60,
    is_active: true
  },

  // Laundry & Fabric Care (category_id: 9)
  {
    name: 'Fabric Softener 2L',
    name_ar: 'منعم الأقمشة 2 لتر',
    description: 'Concentrated fabric softener for extra soft clothes.',
    description_ar: 'منعم أقمشة مركز للملابس الناعمة جداً.',
    price: 22.00,
    category_id: 9,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    stock_quantity: 65,
    is_active: true
  },
  {
    name: 'Stain Remover Spray 300ml',
    name_ar: 'رذاذ إزالة البقع 300 مل',
    description: 'Powerful stain remover for tough stains on all fabrics.',
    description_ar: 'مزيل بقع قوي للبقع الصعبة على جميع الأقمشة.',
    price: 18.50,
    category_id: 9,
    image_url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    stock_quantity: 50,
    is_active: true
  },

  // Kitchen Supplies (category_id: 10)
  {
    name: 'Aluminum Foil Roll 30m',
    name_ar: 'رول ورق الألومنيوم 30 متر',
    description: 'Heavy-duty aluminum foil for cooking and food storage.',
    description_ar: 'ورق ألومنيوم عالي الجودة للطبخ وحفظ الطعام.',
    price: 16.00,
    category_id: 10,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock_quantity: 70,
    is_active: true
  },
  {
    name: 'Plastic Wrap 200m',
    name_ar: 'لفافة بلاستيك 200 متر',
    description: 'Clear plastic wrap for food preservation.',
    description_ar: 'لفافة بلاستيك شفاف لحفظ الطعام.',
    price: 12.75,
    category_id: 10,
    image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
    stock_quantity: 80,
    is_active: true
  },

  // Electronics & Batteries (category_id: 11)
  {
    name: 'AA Batteries Pack (8 pieces)',
    name_ar: 'بطاريات AA عبوة (8 قطع)',
    description: 'Long-lasting alkaline AA batteries for electronic devices.',
    description_ar: 'بطاريات AA قلوية طويلة المدى للأجهزة الإلكترونية.',
    price: 28.00,
    category_id: 11,
    image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    stock_quantity: 55,
    is_active: true
  },
  {
    name: 'Extension Cord 3m',
    name_ar: 'سلك تمديد 3 متر',
    description: 'Heavy-duty extension cord with multiple outlets.',
    description_ar: 'سلك تمديد عالي الجودة مع مقابس متعددة.',
    price: 42.00,
    category_id: 11,
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
    stock_quantity: 25,
    is_active: true
  },

  // School & Office (category_id: 12)
  {
    name: 'Notebook Set A4 (5 pieces)',
    name_ar: 'طقم دفاتر A4 (5 قطع)',
    description: 'High-quality ruled notebooks for school and office use.',
    description_ar: 'دفاتر مسطرة عالية الجودة للمدرسة والمكتب.',
    price: 35.00,
    category_id: 12,
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    stock_quantity: 40,
    is_active: true
  },
  {
    name: 'Pen Set (10 pieces)',
    name_ar: 'طقم أقلام (10 قطع)',
    description: 'Smooth-writing ballpoint pens in blue and black ink.',
    description_ar: 'أقلام حبر ناعمة الكتابة بحبر أزرق وأسود.',
    price: 15.00,
    category_id: 12,
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    stock_quantity: 75,
    is_active: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Initialize database
    await initializeDatabase();

    // Import models after database initialization
    const Category = require('./models/Category');
    const Product = require('./models/Product');
    const User = require('./models/User');

    // Create admin user with secure credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@drogueriejamal.ma';
    const adminPassword = process.env.ADMIN_PASSWORD || 'DroguerieJamal2024!Admin';

    const adminExists = await User.findByEmail(adminEmail);
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created with secure credentials');
    } else {
      // Update existing admin user password if it's still the old default
      const adminUser = await User.findByEmail(adminEmail);
      if (adminUser && adminPassword !== 'admin123' && adminPassword !== 'DroguerieJamal2024!Admin') {
        await User.updatePassword(adminUser.id, adminPassword);
        console.log('✅ Admin user password updated to secure credentials');
      }
    }

    // Seed categories
    console.log('📁 Seeding categories...');
    const categoryIds = {};
    for (const categoryData of categories) {
      const category = await Category.create(categoryData);
      categoryIds[categoryData.name] = category.id;
      console.log(`  ✅ Created category: ${categoryData.name}`);
    }

    // Seed products
    console.log('📦 Seeding products...');
    for (const productData of products) {
      await Product.create(productData);
      console.log(`  ✅ Created product: ${productData.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Categories: ${categories.length}`);
    console.log(`  - Products: ${products.length}`);
    console.log(`  - Admin user: ${process.env.ADMIN_EMAIL || 'admin@drogueriejamal.ma'} (password: ${process.env.ADMIN_PASSWORD || 'DroguerieJamal2024!Admin'})`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

// Run seeding if file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
