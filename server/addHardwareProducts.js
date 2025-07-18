const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Authentic Moroccan Hardware Store Products
const hardwareProducts = [
  // QUINCAILLERIE (Hardware & Tools) - Category ID 6
  {
    name: 'Tournevis Phillips 8mm',
    name_ar: 'مفك براغي فيليبس 8 مم',
    name_fr: 'Tournevis Phillips 8mm',
    description: 'Professional Phillips screwdriver with ergonomic handle, ideal for construction and repair work.',
    description_ar: 'مفك براغي فيليبس احترافي بمقبض مريح، مثالي للبناء وأعمال الإصلاح.',
    description_fr: 'Tournevis Phillips professionnel avec poignée ergonomique, idéal pour la construction et les réparations.',
    price: 25.00,
    category_id: 6,
    image_url: 'http://www.cripedistributing.com/cdn/shop/files/20250319_075816.jpg?v=1742392979',
    stock_quantity: 50,
    brand: 'TALIA',
    weight: '0.2',
    is_active: true
  },
  {
    name: 'Perceuse Électrique 500W',
    name_ar: 'مثقاب كهربائي 500 واط',
    name_fr: 'Perceuse Électrique 500W',
    description: 'Powerful 500W electric drill with variable speed control. Perfect for drilling wood, metal, and masonry.',
    description_ar: 'مثقاب كهربائي قوي 500 واط مع تحكم متغير في السرعة. مثالي لثقب الخشب والمعدن والبناء.',
    description_fr: 'Perceuse électrique puissante de 500W avec contrôle de vitesse variable. Parfaite pour percer le bois, le métal et la maçonnerie.',
    price: 450.00,
    category_id: 6,
    image_url: 'https://www.milwaukeetool.ca/--/web-images/sc/0d1b464a29794f0a8fdef510b7ea4a7b?hash=917f7e7f33508d1f64f4124df35874cf&lang=en-CA',
    stock_quantity: 15,
    brand: 'Milwaukee',
    weight: '1.5',
    is_active: true
  },
  {
    name: 'Marteau Charpentier 500g',
    name_ar: 'مطرقة نجار 500 جرام',
    name_fr: 'Marteau de Charpentier 500g',
    description: 'Professional carpenter hammer with steel head and wooden handle. Essential tool for construction work.',
    description_ar: 'مطرقة نجار احترافية برأس فولاذي ومقبض خشبي. أداة أساسية لأعمال البناء.',
    description_fr: 'Marteau de charpentier professionnel avec tête en acier et manche en bois. Outil essentiel pour les travaux de construction.',
    price: 65.00,
    category_id: 6,
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
    stock_quantity: 35,
    brand: 'Stanley',
    weight: '0.5',
    is_active: true
  },

  // SANITAIRE (Plumbing & Sanitary) - Category ID 5 (Bath Products -> Sanitaire)
  {
    name: 'Robinet Mélangeur Cuisine',
    name_ar: 'صنبور خلاط للمطبخ',
    name_fr: 'Robinet Mélangeur Cuisine',
    description: 'Chrome kitchen mixer tap with single lever control. High quality brass construction with ceramic cartridge.',
    description_ar: 'صنبور مطبخ كروم بذراع واحدة. بناء نحاسي عالي الجودة مع خرطوشة سيراميك.',
    description_fr: 'Robinet mélangeur de cuisine chromé avec commande à levier unique. Construction en laiton de haute qualité avec cartouche céramique.',
    price: 320.00,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
    stock_quantity: 25,
    brand: 'GROHE',
    weight: '2.0',
    is_active: true
  },
  {
    name: 'Tuyau PVC Évacuation Ø100mm',
    name_ar: 'أنبوب PVC للصرف قطر 100 مم',
    name_fr: 'Tuyau PVC Évacuation Ø100mm',
    description: 'PVC drainage pipe 100mm diameter, 3m length. UV resistant, suitable for exterior installations.',
    description_ar: 'أنبوب صرف PVC قطر 100 مم، طول 3 متر. مقاوم للأشعة فوق البنفسجية، مناسب للتركيبات الخارجية.',
    description_fr: 'Tuyau d\'évacuation PVC diamètre 100mm, longueur 3m. Résistant aux UV, adapté aux installations extérieures.',
    price: 85.00,
    category_id: 5,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    stock_quantity: 40,
    brand: 'NICOLL',
    weight: '5.0',
    is_active: true
  },

  // PEINTURE (Paint & Painting Supplies) - Category ID 1
  {
    name: 'Pinceau Plat 5cm',
    name_ar: 'فرشاة مسطحة 5 سم',
    name_fr: 'Pinceau Plat 5cm',
    description: 'Professional flat paint brush 5cm width. Natural bristles, perfect for walls and woodwork.',
    description_ar: 'فرشاة طلاء مسطحة احترافية عرض 5 سم. شعيرات طبيعية، مثالية للجدران والأعمال الخشبية.',
    description_fr: 'Pinceau plat professionnel largeur 5cm. Soies naturelles, parfait pour les murs et les boiseries.',
    price: 35.00,
    category_id: 1,
    image_url: 'http://www.cripedistributing.com/cdn/shop/files/IMG_0908_1.jpg?v=1687898068',
    stock_quantity: 60,
    brand: 'EZPAINTR',
    weight: '0.1',
    is_active: true
  },
  {
    name: 'Peinture Murale Blanche 15L',
    name_ar: 'طلاء جدران أبيض 15 لتر',
    name_fr: 'Peinture Murale Blanche 15L',
    description: 'High quality white wall paint, washable finish. Coverage: approximately 120m² with one coat.',
    description_ar: 'طلاء جدران أبيض عالي الجودة، لمسة نهائية قابلة للغسيل. التغطية: حوالي 120 متر مربع بطبقة واحدة.',
    description_fr: 'Peinture murale blanche de haute qualité, finition lavable. Rendement : environ 120m² en une couche.',
    price: 180.00,
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400',
    stock_quantity: 30,
    brand: 'DULUX',
    weight: '15.0',
    is_active: true
  },

  // ÉLECTRICITÉ (Electrical) - Category ID 11
  {
    name: 'Câble Électrique 2.5mm² (100m)',
    name_ar: 'كابل كهربائي 2.5 ملم² (100 متر)',
    name_fr: 'Câble Électrique 2.5mm² (100m)',
    description: 'Electrical cable 2.5mm² cross-section, 100m roll. Copper conductor with PVC insulation.',
    description_ar: 'كابل كهربائي مقطع عرضي 2.5 ملم²، لفة 100 متر. موصل نحاسي مع عزل PVC.',
    description_fr: 'Câble électrique section 2.5mm², bobine de 100m. Conducteur en cuivre avec isolation PVC.',
    price: 280.00,
    category_id: 11,
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    stock_quantity: 20,
    brand: 'NEXANS',
    weight: '12.0',
    is_active: true
  },
  {
    name: 'Interrupteur Va-et-Vient',
    name_ar: 'مفتاح كهربائي ذهاب وإياب',
    name_fr: 'Interrupteur Va-et-Vient',
    description: 'Two-way electrical switch, white finish. Standard European format, 10A capacity.',
    description_ar: 'مفتاح كهربائي ثنائي الاتجاه، لمسة نهائية بيضاء. تنسيق أوروبي قياسي، سعة 10 أمبير.',
    description_fr: 'Interrupteur électrique bidirectionnel, finition blanche. Format européen standard, capacité 10A.',
    price: 45.00,
    category_id: 11,
    image_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
    stock_quantity: 80,
    brand: 'LEGRAND',
    weight: '0.15',
    is_active: true
  }
];

// Function to add hardware products
async function addHardwareProducts() {
  console.log('🔨 Adding authentic Moroccan hardware store products...');

  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO products (
        name, name_ar, name_fr, description, description_ar, description_fr,
        price, category_id, image_url, stock_quantity, brand, weight, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let completed = 0;
    const total = hardwareProducts.length;

    hardwareProducts.forEach(product => {
      stmt.run([
        product.name,
        product.name_ar,
        product.name_fr || product.name,
        product.description,
        product.description_ar,
        product.description_fr || product.description,
        product.price,
        product.category_id,
        product.image_url,
        product.stock_quantity,
        product.brand || 'Generic',
        product.weight || '1.0',
        product.is_active
      ], function(err) {
        if (err) {
          console.error('❌ Error inserting product:', product.name, err.message);
        } else {
          console.log(`  ✅ Added: ${product.name} (${product.name_ar})`);
        }

        completed++;
        if (completed === total) {
          stmt.finalize();
          console.log(`🎉 Successfully added ${total} hardware products!`);
          resolve();
        }
      });
    });
  });
}

// Run the function
addHardwareProducts()
  .then(() => {
    db.close();
    console.log('✅ Hardware products database update completed!');
  })
  .catch(error => {
    console.error('❌ Error updating database:', error);
    db.close();
    process.exit(1);
  });
