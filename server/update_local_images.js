const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection (from server directory)
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// URL mapping from Unsplash to local files
const imageUrlMap = {
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400': '/uploads/products/product_1_photo-1513475382585-d06e58bcb0e0.jpg',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400': '/uploads/products/product_2_photo-1544367567-0f2fcb009e0b.jpg',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400': '/uploads/products/product_3_photo-1556228453-efd6c1ff04f6.jpg',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400': '/uploads/products/product_4_photo-1556909114-f6e7ad7d3136.jpg',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400': '/uploads/products/product_5_photo-1558618047-3c8c76ca7d13.jpg',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400': '/uploads/products/product_6_photo-1559757148-5c350d0d3c56.jpg',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400': '/uploads/products/product_7_photo-1571019613454-1cb2f99b2d8b.jpg',
  'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400': '/uploads/products/product_8_photo-1572981779307-38b8cabb2407.jpg',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400': '/uploads/products/product_9_photo-1576091160399-112ba8d25d1f.jpg',
  'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400': '/uploads/products/product_10_photo-1584464491033-06628f3a6b7b.jpg',
  'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400': '/uploads/products/product_11_photo-1585421514738-01798e348b17.jpg',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400': '/uploads/products/product_12_photo-1596462502278-27bfdc403348.jpg',
  'https://images.unsplash.com/photo-1606787366850-de6ba128a8ec?w=400': '/uploads/products/product_13_photo-1606787366850-de6ba128a8ec.jpg',
  'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400': '/uploads/products/product_14_photo-1607613009820-a29f7bb81c04.jpg'
};

async function updateImageUrls() {
  console.log('🔄 Starting image URL update process...');

  return new Promise((resolve, reject) => {
    // First, check if the products table exists and has data
    db.all("SELECT id, name, image_url FROM products WHERE image_url LIKE 'https://images.unsplash.com%'", (err, rows) => {
      if (err) {
        console.error('❌ Error reading products:', err);
        reject(err);
        return;
      }

      if (rows.length === 0) {
        console.log('ℹ️ No products with Unsplash URLs found in database');
        console.log('💡 This might mean:');
        console.log('   - Database hasn\'t been seeded yet');
        console.log('   - URLs have already been updated');
        console.log('   - Products table doesn\'t exist');
        resolve();
        return;
      }

      console.log(`📊 Found ${rows.length} products with Unsplash URLs`);

      let updatedCount = 0;
      let totalToUpdate = rows.length;

      // Update each product
      rows.forEach((product) => {
        const oldUrl = product.image_url;
        const newUrl = imageUrlMap[oldUrl];

        if (newUrl) {
          db.run(
            "UPDATE products SET image_url = ? WHERE id = ?",
            [newUrl, product.id],
            function(err) {
              if (err) {
                console.error(`❌ Error updating product ${product.id}:`, err);
              } else {
                console.log(`✅ Updated product "${product.name}": ${oldUrl} → ${newUrl}`);
                updatedCount++;
              }

              // Check if all updates are complete
              if (updatedCount === totalToUpdate) {
                console.log(`\n🎉 Successfully updated ${updatedCount} product image URLs!`);
                console.log('📱 Products now use local images instead of Unsplash');
                resolve();
              }
            }
          );
        } else {
          console.log(`⚠️ No local mapping found for: ${oldUrl}`);
          totalToUpdate--;
          if (updatedCount === totalToUpdate) {
            resolve();
          }
        }
      });
    });
  });
}

async function verifyUpdate() {
  console.log('\n🔍 Verifying the update...');

  return new Promise((resolve, reject) => {
    db.all("SELECT name, image_url FROM products LIMIT 5", (err, rows) => {
      if (err) {
        console.error('❌ Error verifying update:', err);
        reject(err);
        return;
      }

      console.log('\n📋 Sample products after update:');
      rows.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}: ${product.image_url}`);
      });

      resolve();
    });
  });
}

async function main() {
  try {
    await updateImageUrls();
    await verifyUpdate();
  } catch (error) {
    console.error('❌ Update failed:', error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err);
      } else {
        console.log('\n✅ Database connection closed');
        console.log('🚀 Image URL update process completed!');
      }
    });
  }
}

// Run the update
main();
