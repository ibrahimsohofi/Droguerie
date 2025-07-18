const { initializeDatabase } = require('./config/db');
const Product = require('./models/Product');

// High-quality product images URLs
const realProductImages = {
  // Cleaning Products
  'Ariel Detergent Powder 3kg': 'https://images.thdstatic.com/productImages/b8a6ccf7-7313-4a93-b6fb-7d7e047ed829/svn/tide-laundry-detergents-003077212214-64_600.jpg',
  'Ajax Floor Cleaner 1L': 'https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/rockcms/2024-04/240415-eco-friendly-cleaning-bd-social-4a72ba.jpg',
  'Javex Bleach 2L': 'https://images.thdstatic.com/productImages/4779f0fe-ef5d-4149-b35d-8057f6eeddb1/svn/goof-off-concrete-cleaners-fg820-64_600.jpg',
  'Glass Cleaner Spray 500ml': 'https://housemart.sa/cdn/shop/files/7002835_31ca2891-ecc5-40b8-a2d0-f5ee0a52ccf7.jpg?v=1745011011',

  // Personal Care
  'Dove Beauty Bar 90g': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
  'Head & Shoulders Shampoo 400ml': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
  'Colgate Total Toothpaste 100ml': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
  'Oral-B Toothbrush Medium': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop',

  // Cosmetics & Beauty
  'L\'Oréal Face Cream 50ml': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  'Nivea Hand Cream 100ml': 'https://images.unsplash.com/photo-1606787366850-de6ba128a8ec?w=400&h=400&fit=crop',
  'Maybelline Mascara': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop',

  // Household Items
  'Plastic Storage Containers Set': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
  'Kitchen Sponges Pack (6 pieces)': 'https://article.images.consumerreports.org/image/upload/t_article_tout/v1740765669/prod/content/dam/product-cards/CR-Shopping-InlineHero-Cleaning-Products-Tests-2-25',
  'Cotton Bath Towels Set': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',

  // Bath Products
  'Shower Gel Vanilla 500ml': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop',

  // Hardware & Tools
  'Multi-purpose Screwdriver Set': 'https://www.hardwarestore.com/media/wysiwyg/IMG_3709_-_Aubuchon_TEWKSBURY_MA_-_007_1.jpg?auto=webp&format=pjpg&quality=85',
  'LED Flashlight': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',

  // Health & Medicine
  'Digital Thermometer': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  'First Aid Kit': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop',

  // Baby Products
  'Baby Diapers Size 3 (40 pieces)': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop',
  'Baby Shampoo 200ml': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',

  // Laundry & Fabric Care
  'Fabric Softener 2L': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
  'Stain Remover Spray 300ml': 'https://www.seriouseats.com/thmb/ROsM-LnAKTxHkF9Fx6yE8Jsi4Kk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SERIOUS-EATS-staff-favorites-cleaning-products-01-37a9f72fc2d64b20a832bc7ef1e96fc5.jpg',

  // Kitchen Supplies
  'Aluminum Foil Roll 30m': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
  'Plastic Wrap 200m': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',

  // Electronics & Batteries
  'AA Batteries Pack (8 pieces)': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
  'Extension Cord 3m': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop',

  // School & Office
  'Notebook Set A4 (5 pieces)': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
  'Pen Set (10 pieces)': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'
};

const updateProductImages = async () => {
  try {
    console.log('🖼️ Starting product image updates...');

    // Initialize database
    await initializeDatabase();

    let updatedCount = 0;

    // Update each product with real images
    for (const [productName, imageUrl] of Object.entries(realProductImages)) {
      try {
        const result = await Product.updateImageByName(productName, imageUrl);
        if (result.changes > 0) {
          console.log(`  ✅ Updated image for: ${productName}`);
          updatedCount++;
        } else {
          console.log(`  ⚠️ Product not found: ${productName}`);
        }
      } catch (error) {
        console.log(`  ❌ Failed to update ${productName}: ${error.message}`);
      }
    }

    console.log(`\n🎉 Product image update completed!`);
    console.log(`📊 Summary: ${updatedCount} products updated with real images`);

  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    process.exit(0);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  updateProductImages();
}

module.exports = { updateProductImages, realProductImages };
