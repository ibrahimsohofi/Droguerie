const { initializeDatabase } = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const { pool } = require('./config/db');

// New categories for outilmarket.ma products
const newCategories = [
  {
    name: 'Adhesives & Glues',
    name_ar: 'لواصق وغراء',
    description: 'Adhesive tapes, glues and bonding materials'
  },
  {
    name: 'Packaging Materials',
    name_ar: 'مواد التعبئة والتغليف',
    description: 'Packaging films, bubble wrap and shipping materials'
  },
  {
    name: 'Safety Equipment',
    name_ar: 'معدات السلامة',
    description: 'Safety gear and protective equipment'
  },
  {
    name: 'Industrial Tools',
    name_ar: 'أدوات صناعية',
    description: 'Professional industrial tools and equipment'
  }
];

// Products from outilmarket.ma with real images
const newProducts = [
  // Adhesives & Glues
  {
    name: '10 Pièces Ruban Isolant INGCO 9.15m - Noir',
    name_ar: '10 قطع شريط عازل إنجكو 9.15 متر - أسود',
    description: 'Set of 10 black electrical insulation tapes, 9.15m each. INGCO brand professional quality.',
    description_ar: 'مجموعة من 10 أشرطة عازلة كهربائية سوداء، 9.15 متر لكل منها. جودة احترافية من ماركة إنجكو.',
    price: 60.00,
    category_name: 'Adhesives & Glues',
    image_url: 'https://ext.same-assets.com/4021535711/4191168172.jpeg',
    stock_quantity: 25,
    is_active: true
  },
  {
    name: '5x Ruban noir en PVC 5 Pièces - Polyfix',
    name_ar: '5 قطع شريط أسود من البي في سي - بوليفيكس',
    description: 'Set of 5 black PVC tapes from Polyfix. Ideal for electrical insulation and repairs.',
    description_ar: 'مجموعة من 5 أشرطة سوداء من البي في سي من بوليفيكس. مثالية للعزل الكهربائي والإصلاحات.',
    price: 45.00,
    category_name: 'Adhesives & Glues',
    image_url: 'https://ext.same-assets.com/4021535711/3148316274.jpeg',
    stock_quantity: 30,
    is_active: true
  },
  {
    name: 'Bâtonnets de colle (boîte de 1 KG)',
    name_ar: 'عصي الغراء (علبة 1 كيلو)',
    description: 'Hot glue sticks in 1kg box. Perfect for crafts, repairs and industrial applications.',
    description_ar: 'عصي الغراء الساخن في علبة 1 كيلو. مثالية للحرف اليدوية والإصلاحات والتطبيقات الصناعية.',
    price: 90.00,
    category_name: 'Adhesives & Glues',
    image_url: 'https://ext.same-assets.com/4021535711/4217333981.jpeg',
    stock_quantity: 15,
    is_active: true
  },
  {
    name: 'Ruban adhésif mousse Double face',
    name_ar: 'شريط لاصق إسفنجي الوجهين',
    description: 'Double-sided foam adhesive tape. Strong bonding for various surfaces.',
    description_ar: 'شريط لاصق إسفنجي الوجهين. ربط قوي لمختلف الأسطح.',
    price: 10.00,
    category_name: 'Adhesives & Glues',
    image_url: 'https://ext.same-assets.com/4021535711/1790199025.jpeg',
    stock_quantity: 40,
    is_active: true
  },
  {
    name: 'Ruban adhésif transparent 48x600cm 6pcs',
    name_ar: 'شريط لاصق شفاف 48×600 سم 6 قطع',
    description: 'Pack of 6 transparent adhesive tapes, 48x600cm each. Clear packaging tape.',
    description_ar: 'عبوة من 6 أشرطة لاصقة شفافة، 48×600 سم لكل منها. شريط تعبئة شفاف.',
    price: 45.00,
    category_name: 'Adhesives & Glues',
    image_url: 'https://ext.same-assets.com/4021535711/1703485103.jpeg',
    stock_quantity: 20,
    is_active: true
  },

  // Packaging Materials
  {
    name: 'FILM A BULLES 110 cm x 100 m',
    name_ar: 'فيلم فقاعي 110 سم × 100 متر',
    description: 'Bubble wrap film 110cm x 100m. Excellent protection for fragile items during shipping.',
    description_ar: 'فيلم فقاعي 110 سم × 100 متر. حماية ممتازة للأشياء الهشة أثناء الشحن.',
    price: 299.00,
    category_name: 'Packaging Materials',
    image_url: 'https://ext.same-assets.com/4021535711/4244261702.jpeg',
    stock_quantity: 10,
    is_active: true
  },
  {
    name: 'FILM ETIRABLE NOIR 1,8Kg',
    name_ar: 'فيلم قابل للتمدد أسود 1.8 كيلو',
    description: 'Black stretch film 1.8kg. Heavy-duty packaging film for securing loads.',
    description_ar: 'فيلم قابل للتمدد أسود 1.8 كيلو. فيلم تعبئة عالي التحمل لتأمين الأحمال.',
    price: 185.00,
    category_name: 'Packaging Materials',
    image_url: 'https://ext.same-assets.com/4021535711/1622494947.jpeg',
    stock_quantity: 12,
    is_active: true
  },

  // Safety Equipment
  {
    name: 'Casque Anti Bruit - Ajustable',
    name_ar: 'خوذة مانعة للضوضاء - قابلة للتعديل',
    description: 'Adjustable noise-cancelling headset. Professional hearing protection for industrial use.',
    description_ar: 'سماعة رأس قابلة للتعديل مانعة للضوضاء. حماية سمع احترافية للاستخدام الصناعي.',
    price: 35.00,
    category_name: 'Safety Equipment',
    image_url: 'https://ext.same-assets.com/4021535711/161084289.jpeg',
    stock_quantity: 25,
    is_active: true,
    original_price: 55.00
  },

  // Industrial Tools
  {
    name: 'Cercleuse semi-automatique standard',
    name_ar: 'ماكينة ربط نصف أوتوماتيكية قياسية',
    description: 'Semi-automatic strapping machine. Standard model for packaging and bundling operations.',
    description_ar: 'ماكينة ربط نصف أوتوماتيكية. موديل قياسي لعمليات التعبئة والربط.',
    price: 850.00,
    category_name: 'Industrial Tools',
    image_url: 'https://ext.same-assets.com/4021535711/3639747540.jpeg',
    stock_quantity: 5,
    is_active: true
  },
  {
    name: 'Lampe à souder à briquet',
    name_ar: 'مصباح لحام بالولاعة',
    description: 'Welding torch with lighter. Professional torch for welding and heating applications.',
    description_ar: 'مشعل لحام مع ولاعة. مشعل احترافي لتطبيقات اللحام والتسخين.',
    price: 250.00,
    category_name: 'Industrial Tools',
    image_url: 'https://ext.same-assets.com/4021535711/2222978520.jpeg',
    stock_quantity: 8,
    is_active: true
  }
];

// Helper function to find or create category
const findOrCreateCategory = async (categoryData) => {
  try {
    // Check if category exists by name
    const [rows] = await pool.promise().execute(
      'SELECT * FROM categories WHERE name = ?',
      [categoryData.name]
    );

    if (rows.length > 0) {
      return { category: rows[0], created: false };
    }

    // Create new category
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
    // Check if product exists by name
    const [rows] = await pool.promise().execute(
      'SELECT * FROM products WHERE name = ?',
      [productData.name]
    );

    if (rows.length > 0) {
      return { product: rows[0], created: false };
    }

    // Create new product
    const newProduct = await Product.create(productData);
    return { product: newProduct, created: true };
  } catch (error) {
    console.error('Error in findOrCreateProduct:', error);
    throw error;
  }
};

const addNewProducts = async () => {
  try {
    await initializeDatabase();
    console.log('🚀 Adding new products from outilmarket.ma...\n');

    // Add new categories
    console.log('📂 Adding new categories...');
    const categoryMap = {};

    for (const categoryData of newCategories) {
      const { category, created } = await findOrCreateCategory(categoryData);
      categoryMap[categoryData.name] = category.id;
      console.log(`${created ? '✅ Created' : '🔄 Found'} category: ${categoryData.name}`);
    }

    // Add new products
    console.log('\n📦 Adding new products...');
    let addedCount = 0;

    for (const productData of newProducts) {
      const category_id = categoryMap[productData.category_name];

      if (!category_id) {
        console.log(`❌ Category not found for: ${productData.name}`);
        continue;
      }

      // Remove category_name from productData and add category_id
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

    console.log('\n🎉 Product addition completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - New categories: ${newCategories.length}`);
    console.log(`  - New products added: ${addedCount}/${newProducts.length}`);
    console.log(`  - Total products processed: ${newProducts.length}`);

  } catch (error) {
    console.error('❌ Error adding new products:', error);
  } finally {
    process.exit(0);
  }
};

// Run if file is executed directly
if (require.main === module) {
  addNewProducts();
}

module.exports = { addNewProducts };
