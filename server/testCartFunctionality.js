const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCartFunctionality() {
  console.log('🛒 Testing Shopping Cart Functionality...\n');

  try {
    // Test 1: Add product to guest cart
    console.log('1. Testing: Add product to guest cart');
    const addToCartResponse = await axios.post(`${API_BASE}/cart/add`, {
      userId: 'guest-test-123',
      productId: 1,
      quantity: 2
    });
    console.log('✅ Add to cart:', addToCartResponse.data);

    // Test 2: Get cart contents
    console.log('\n2. Testing: Get cart contents');
    const cartResponse = await axios.get(`${API_BASE}/cart/guest-test-123`);
    console.log('✅ Cart contents:', JSON.stringify(cartResponse.data, null, 2));

    // Test 3: Add another product
    console.log('\n3. Testing: Add another product');
    const addSecondResponse = await axios.post(`${API_BASE}/cart/add`, {
      userId: 'guest-test-123',
      productId: 2,
      quantity: 1
    });
    console.log('✅ Add second product:', addSecondResponse.data);

    // Test 4: Update quantity
    console.log('\n4. Testing: Update product quantity');
    const updateResponse = await axios.put(`${API_BASE}/cart/update`, {
      userId: 'guest-test-123',
      productId: 1,
      quantity: 3
    });
    console.log('✅ Update quantity:', updateResponse.data);

    // Test 5: Get updated cart
    console.log('\n5. Testing: Get updated cart');
    const updatedCartResponse = await axios.get(`${API_BASE}/cart/guest-test-123`);
    console.log('✅ Updated cart:', JSON.stringify(updatedCartResponse.data, null, 2));

    // Test 6: Get cart count
    console.log('\n6. Testing: Get cart count');
    const countResponse = await axios.get(`${API_BASE}/cart/count/guest-test-123`);
    console.log('✅ Cart count:', countResponse.data);

    console.log('\n🎉 All cart tests completed successfully!');

  } catch (error) {
    console.error('❌ Cart test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Full error:', error.code || error.errno);
  }
}

// Run the tests
testCartFunctionality().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
