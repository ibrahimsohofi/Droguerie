const { initializeDatabase } = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const { pool } = require('./config/db');

// New categories for hand tools
const newCategories = [
  {
    name: 'Hand Tools & Sets',
    name_ar: 'أدوات يدوية ومجموعات',
    description: 'Professional hand tools, tool sets and toolboxes'
  },
  {
    name: 'Cutting Tools',
    name_ar: 'أدوات القطع',
    description: 'Scissors, cutting tools and precision instruments'
  },
  {
    name: 'Socket & Ratchet Sets',
    name_ar: 'مجموعات المقابس والراتشت',
    description: 'Socket sets, ratchets and drive tools'
  },
  {
    name: 'Storage & Organization',
    name_ar: 'التخزين والتنظيم',
    description: 'Tool boxes, storage cases and organization solutions'
  }
];

// Hand tools from outilmarket.ma
const handToolProducts = [
  // Hand Tools & Sets
  {
    name: '3 Jeux De 25pcs (Clés Mâles + Clés à Tête Sphérique + Clés Torx)',
    name_ar: '3 مجموعات من 25 قطعة (مفاتيح ذكور + مفاتيح كروية الرأس + مفاتيح توركس)',
    description: 'Professional set of 3 tool kits with 25 pieces each: Male keys, spherical head keys, and Torx keys. High-quality steel construction.',
    description_ar: 'مجموعة احترافية من 3 عدد أدوات تحتوي على 25 قطعة لكل منها: مفاتيح ذكور، مفاتيح كروية الرأس، ومفاتيح توركس. صناعة فولاذية عالية الجودة.',
    price: 113.60,
    category_name: 'Hand Tools & Sets',
    image_url: 'https://ext.same-assets.com/4021535711/35614680.jpeg',
    stock_quantity: 15,
    is_active: true,
    original_price: 150.00
  },
  {
    name: '6 Pièces/ensemble équerre magnétique 25LBS Triangle Angle Fixateur de Soudage',
    name_ar: '6 قطع مجموعة زاوية مغناطيسية 25 رطل مثلث مثبت لحام',
    description: '6-piece magnetic square set, 25LBS capacity. Triangle angle welding fixtures for professional welding and metalwork.',
    description_ar: 'مجموعة من 6 قطع زاوية مغناطيسية بسعة 25 رطل. مثبتات زاوية مثلثية للحام الاحترافي وأعمال المعادن.',
    price: 120.00,
    category_name: 'Hand Tools & Sets',
    image_url: 'https://ext.same-assets.com/4021535711/2309552716.jpeg',
    stock_quantity: 20,
    is_active: true
  },
  {
    name: 'Agrafeuse - WORKSITE',
    name_ar: 'دباسة - ووركسايت',
    description: 'Professional heavy-duty stapler from WORKSITE. Durable construction for industrial and construction applications.',
    description_ar: 'دباسة احترافية عالية التحمل من ووركسايت. بناء متين للتطبيقات الصناعية والإنشائية.',
    price: 85.00,
    category_name: 'Hand Tools & Sets',
    image_url: 'https://ext.same-assets.com/4021535711/4272636469.png',
    stock_quantity: 30,
    is_active: true,
    original_price: 95.00
  },
  {
    name: 'Boîte à onglets de serrage avec scie arrière 300mm',
    name_ar: 'صندوق قطع الزوايا مع منشار خلفي 300 مم',
    description: 'Miter box with back saw 300mm. Precision cutting tool for accurate angle cuts in wood and other materials.',
    description_ar: 'صندوق قطع الزوايا مع منشار خلفي 300 مم. أداة قطع دقيقة للقطع الزاوي الدقيق في الخشب والمواد الأخرى.',
    price: 179.00,
    category_name: 'Cutting Tools',
    image_url: 'https://ext.same-assets.com/4021535711/882664956.jpeg',
    stock_quantity: 12,
    is_active: true
  },

  // Storage & Organization
  {
    name: 'Boîte à outils en plastique - WORKSITE',
    name_ar: 'صندوق أدوات بلاستيكي - ووركسايت',
    description: 'Durable plastic toolbox from WORKSITE. Lightweight yet strong construction with secure latches and comfortable handle.',
    description_ar: 'صندوق أدوات بلاستيكي متين من ووركسايت. بناء خفيف الوزن لكن قوي مع أقفال آمنة ومقبض مريح.',
    price: 180.00,
    category_name: 'Storage & Organization',
    image_url: 'https://ext.same-assets.com/4021535711/2403530635.jpeg',
    stock_quantity: 25,
    is_active: true,
    original_price: 192.00
  },
  {
    name: 'Boîte à Outils Métallique - FORD',
    name_ar: 'صندوق أدوات معدني - فورد',
    description: 'Professional metal toolbox from FORD. Heavy-duty construction with multiple compartments and secure locking mechanism.',
    description_ar: 'صندوق أدوات معدني احترافي من فورد. بناء عالي التحمل مع حجرات متعددة وآلية قفل آمنة.',
    price: 499.00,
    category_name: 'Storage & Organization',
    image_url: 'https://ext.same-assets.com/4021535711/372730184.jpeg',
    stock_quantity: 8,
    is_active: true,
    original_price: 654.00
  },
  {
    name: 'CAISSE A OUTILS METAL 5 COMPARTIMENTS',
    name_ar: 'صندوق أدوات معدني 5 أقسام',
    description: 'Premium metal tool case with 5 compartments. Professional-grade storage solution with organized sections for different tools.',
    description_ar: 'صندوق أدوات معدني فاخر مع 5 أقسام. حل تخزين احترافي مع أقسام منظمة للأدوات المختلفة.',
    price: 1100.00,
    category_name: 'Storage & Organization',
    image_url: 'https://ext.same-assets.com/4021535711/3577165428.jpeg',
    stock_quantity: 5,
    is_active: true
  },

  // Cutting Tools
  {
    name: 'Ciseaux 215mm Ingco',
    name_ar: 'مقص 215 مم إنجكو',
    description: 'Professional scissors 215mm from Ingco. Sharp stainless steel blades with comfortable grip handles.',
    description_ar: 'مقص احترافي 215 مم من إنجكو. شفرات فولاذية مقاومة للصدأ حادة مع مقابض مريحة.',
    price: 19.00,
    category_name: 'Cutting Tools',
    image_url: 'https://ext.same-assets.com/4021535711/1784646260.jpeg',
    stock_quantity: 40,
    is_active: true
  },

  // Socket & Ratchet Sets
  {
    name: 'clé à cliquet 1/2"',
    name_ar: 'مفتاح راتشت 1/2 بوصة',
    description: 'Professional 1/2" ratchet wrench. High-quality steel construction with smooth ratcheting mechanism.',
    description_ar: 'مفتاح راتشت احترافي 1/2 بوصة. بناء فولاذي عالي الجودة مع آلية راتشت ناعمة.',
    price: 65.00,
    category_name: 'Socket & Ratchet Sets',
    image_url: 'https://ext.same-assets.com/4021535711/2566572593.jpeg',
    stock_quantity: 25,
    is_active: true
  },
  {
    name: 'clé à cliquet 1/4"',
    name_ar: 'مفتاح راتشت 1/4 بوصة',
    description: 'Compact 1/4" ratchet wrench. Perfect for precision work and tight spaces. Durable chrome finish.',
    description_ar: 'مفتاح راتشت مدمج 1/4 بوصة. مثالي للعمل الدقيق والأماكن الضيقة. تشطيب كروم متين.',
    price: 40.00,
    category_name: 'Socket & Ratchet Sets',
    image_url: 'https://ext.same-assets.com/4021535711/287720115.png',
    stock_quantity: 30,
    is_active: true
  },
  {
    name: 'CLE A CLIQUET SANS FIL 12V - 1.5Ah 2 BATTERIE + CHARGEUR',
    name_ar: 'مفتاح راتشت لاسلكي 12 فولت - 1.5 أمبير 2 بطارية + شاحن',
    description: 'Cordless 12V ratchet wrench kit with 1.5Ah batteries. Includes 2 batteries and charger. Perfect for automotive and industrial work.',
    description_ar: 'مجموعة مفتاح راتشت لاسلكي 12 فولت مع بطاريات 1.5 أمبير. تشمل بطاريتين وشاحن. مثالية للعمل في السيارات والصناعة.',
    price: 699.00,
    category_name: 'Socket & Ratchet Sets',
    image_url: 'https://ext.same-assets.com/4021535711/157249472.png',
    stock_quantity: 6,
    is_active: true
  }
];

// Helper function to find or create category
const findOrCreateCategory = async (categoryData) => {
  try {
    const [rows] = await pool.promise().execute(
      'SELECT * FROM categories WHERE name = ?',
      [categoryData.name]
    );

    if (rows.length > 0) {
      return { category: rows[0], created: false };
    }

    const newCategory = await Category.create(categoryData);
    return { category: newCategory, created: true };
  } catch (error) {
    console.error('Error in findOrCreateCategory:', error);
    throw error;
  }
};

// Helper function to find or create product
const findOrCreateProduct = async (productData) => {
  try {
    const [rows] = await pool.promise().execute(
      'SELECT * FROM products WHERE name = ?',
      [productData.name]
    );

    if (rows.length > 0) {
      return { product: rows[0], created: false };
    }

    const newProduct = await Product.create(productData);
    return { product: newProduct, created: true };
  } catch (error) {
    console.error('Error in findOrCreateProduct:', error);
    throw error;
  }
};

const addHandTools = async () => {
  try {
    await initializeDatabase();
    console.log('🛠️ Adding hand tools from outilmarket.ma...\n');

    // Add new categories
    console.log('📂 Adding hand tool categories...');
    const categoryMap = {};

    for (const categoryData of newCategories) {
      const { category, created } = await findOrCreateCategory(categoryData);
      categoryMap[categoryData.name] = category.id;
      console.log(`${created ? '✅ Created' : '🔄 Found'} category: ${categoryData.name}`);
    }

    // Add new products
    console.log('\n🔧 Adding hand tool products...');
    let addedCount = 0;

    for (const productData of handToolProducts) {
      const category_id = categoryMap[productData.category_name];

      if (!category_id) {
        console.log(`❌ Category not found for: ${productData.name}`);
        continue;
      }

      const { category_name, ...productWithCategoryId } = productData;
      productWithCategoryId.category_id = category_id;

      const { product, created } = await findOrCreateProduct(productWithCategoryId);

      if (created) {
        addedCount++;
        console.log(`✅ Added: ${product.name} - ${product.price} MAD`);
      } else {
        console.log(`🔄 Already exists: ${product.name}`);
      }
    }

    console.log('\n🎉 Hand tools addition completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - New categories: ${newCategories.length}`);
    console.log(`  - New products added: ${addedCount}/${handToolProducts.length}`);
    console.log(`  - Total products processed: ${handToolProducts.length}`);

  } catch (error) {
    console.error('❌ Error adding hand tools:', error);
  } finally {
    process.exit(0);
  }
};

// Run if file is executed directly
if (require.main === module) {
  addHandTools();
}

module.exports = { addHandTools };
