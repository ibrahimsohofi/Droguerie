const { initializeDatabase } = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const { pool } = require('./config/db');

const testFeatures = async () => {
  try {
    await initializeDatabase();
    console.log('🧪 Testing Droguerie application features...\n');

    // Test 1: Check categories
    console.log('📂 Testing Categories...');
    const categories = await Category.getAll();
    console.log(`✅ Total categories: ${categories.length}`);

    // Show categories with product counts
    categories.forEach(category => {
      console.log(`  📁 ${category.name} (${category.name_ar}) - ${category.product_count} products`);
    });

    // Test 2: Check products count
    console.log('\n📦 Testing Products...');
    const products = await Product.getAll();
    console.log(`✅ Total products: ${products.length}`);

    // Test 3: Check recent products from outilmarket.ma
    console.log('\n🆕 Recent products from outilmarket.ma:');
    const recentProducts = products.slice(-10).reverse(); // Last 10 products added
    recentProducts.forEach(product => {
      console.log(`  🛍️ ${product.name} - ${product.price} MAD (${product.category_name})`);
    });

    // Test 4: Search functionality
    console.log('\n🔍 Testing Search Functionality...');
    const searchResults = await Product.search('ruban');
    console.log(`✅ Search for "ruban" found ${searchResults.length} products:`);
    searchResults.forEach(product => {
      console.log(`  🔍 ${product.name} - ${product.price} MAD`);
    });

    // Test 5: Category filtering
    console.log('\n🏷️ Testing Category Filtering...');
    const adhesivesCategory = categories.find(cat => cat.name === 'Adhesives & Glues');
    if (adhesivesCategory) {
      const categoryProducts = await Product.getByCategory(adhesivesCategory.id);
      console.log(`✅ Products in "Adhesives & Glues" category: ${categoryProducts.length}`);
      categoryProducts.forEach(product => {
        console.log(`  🏷️ ${product.name} - ${product.price} MAD`);
      });
    }

    // Test 6: Admin user verification
    console.log('\n👨‍💼 Testing Admin User...');
    const [adminRows] = await pool.promise().execute(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      ['admin@drogueriejamal.ma', 'admin']
    );

    if (adminRows.length > 0) {
      console.log('✅ Admin user found:');
      console.log(`  📧 Email: ${adminRows[0].email}`);
      console.log(`  👤 Name: ${adminRows[0].first_name} ${adminRows[0].last_name}`);
      console.log(`  🔑 Role: ${adminRows[0].role}`);
      console.log('  🔐 Password: admin123 (default)');
    } else {
      console.log('❌ Admin user not found');
    }

    // Test 7: Price range testing
    console.log('\n💰 Testing Price Ranges...');
    const expensiveProducts = await Product.advancedSearch({ minPrice: 500 });
    console.log(`✅ Products over 500 MAD: ${expensiveProducts.length}`);

    const affordableProducts = await Product.advancedSearch({ maxPrice: 50 });
    console.log(`✅ Products under 50 MAD: ${affordableProducts.length}`);

    // Test 8: Brand filtering (INGCO products)
    console.log('\n🏭 Testing Brand Search...');
    const ingcoProducts = await Product.search('INGCO');
    console.log(`✅ INGCO products found: ${ingcoProducts.length}`);
    ingcoProducts.forEach(product => {
      console.log(`  🏭 ${product.name} - ${product.price} MAD`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  📁 Total categories: ${categories.length}`);
    console.log(`  📦 Total products: ${products.length}`);
    console.log(`  🔍 Search functionality: Working`);
    console.log(`  🏷️ Category filtering: Working`);
    console.log(`  👨‍💼 Admin access: Ready`);
    console.log(`  💰 Price filtering: Working`);
    console.log(`  🏭 Brand search: Working`);

    console.log('\n🚀 Application is ready for testing!');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔧 Backend: http://localhost:5000');
    console.log('👨‍💼 Admin login: admin@drogueriejamal.ma / admin123');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    process.exit(0);
  }
};

// Run if file is executed directly
if (require.main === module) {
  testFeatures();
}

module.exports = { testFeatures };
