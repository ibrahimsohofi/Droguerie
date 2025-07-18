const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
const CLIENT_BASE = 'http://localhost:5173';

class EcommerceFlowTester {
  constructor() {
    this.authToken = null;
    this.userId = null;
    this.testResults = {
      healthCheck: false,
      productListing: false,
      productDetail: false,
      userRegistration: false,
      userLogin: false,
      addToCart: false,
      cartRetrieval: false,
      orderCreation: false,
      adminLogin: false,
      adminProducts: false,
      adminOrders: false
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Droguerie Jamal E-commerce Flow Tests');
    console.log('=' .repeat(60));

    try {
      await this.testHealthCheck();
      await this.testProductListing();
      await this.testProductDetail();
      await this.testUserFlow();
      await this.testAdminFlow();

      this.displayResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
    }
  }

  async testHealthCheck() {
    try {
      console.log('🔍 Testing API Health Check...');
      const response = await axios.get(`${API_BASE}/health`, { timeout: 5000 });

      if (response.data.success) {
        this.testResults.healthCheck = true;
        console.log('✅ Health check passed');
        console.log(`   Environment: ${response.data.environment}`);
        console.log(`   Version: ${response.data.version}`);
      }
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
    }
  }

  async testProductListing() {
    try {
      console.log('🛒 Testing Product Listing...');
      const response = await axios.get(`${API_BASE}/products`, { timeout: 10000 });

      if (Array.isArray(response.data) && response.data.length > 0) {
        this.testResults.productListing = true;
        console.log(`✅ Product listing successful (${response.data.length} products)`);
        console.log(`   Sample product: ${response.data[0].name}`);
        console.log(`   Price: ${response.data[0].price} MAD`);
      }
    } catch (error) {
      console.log('❌ Product listing failed:', error.message);
    }
  }

  async testProductDetail() {
    try {
      console.log('📦 Testing Product Detail...');
      const response = await axios.get(`${API_BASE}/products/1`, { timeout: 5000 });

      if (response.data && response.data.id) {
        this.testResults.productDetail = true;
        console.log('✅ Product detail successful');
        console.log(`   Product: ${response.data.name}`);
        console.log(`   Category: ${response.data.category_name}`);
      }
    } catch (error) {
      console.log('❌ Product detail failed:', error.message);
    }
  }

  async testUserFlow() {
    try {
      console.log('👤 Testing User Registration...');

      // Test user registration
      const regData = {
        firstName: 'Test',
        lastName: 'Customer',
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        phone: '+212600000000'
      };

      try {
        const regResponse = await axios.post(`${API_BASE}/auth/register`, regData, { timeout: 5000 });
        if (regResponse.data.success) {
          this.testResults.userRegistration = true;
          console.log('✅ User registration successful');
        }
      } catch (regError) {
        console.log('⚠️ User registration skipped (may already exist)');
      }

      // Test user login with admin credentials
      console.log('🔐 Testing User Login...');
      const loginData = {
        email: 'admin@drogueriejamal.ma',
        password: 'DroguerieJamal2024!SecureAdmin'
      };

      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData, { timeout: 5000 });
        if (loginResponse.data.success && loginResponse.data.token) {
          this.testResults.userLogin = true;
          this.authToken = loginResponse.data.token;
          this.userId = loginResponse.data.user.id;
          console.log('✅ User login successful');
          console.log(`   User: ${loginResponse.data.user.first_name} ${loginResponse.data.user.last_name}`);
        }
      } catch (loginError) {
        console.log('❌ User login failed:', loginError.message);
      }

      // Test cart functionality
      if (this.authToken) {
        await this.testCartFlow();
      }
    } catch (error) {
      console.log('❌ User flow failed:', error.message);
    }
  }

  async testCartFlow() {
    try {
      console.log('🛒 Testing Add to Cart...');

      const cartData = {
        productId: 1,
        quantity: 2
      };

      const headers = { Authorization: `Bearer ${this.authToken}` };

      const addResponse = await axios.post(`${API_BASE}/cart`, cartData, { headers, timeout: 5000 });
      if (addResponse.data.success) {
        this.testResults.addToCart = true;
        console.log('✅ Add to cart successful');
      }

      // Test cart retrieval
      console.log('📋 Testing Cart Retrieval...');
      const cartResponse = await axios.get(`${API_BASE}/cart`, { headers, timeout: 5000 });
      if (cartResponse.data && Array.isArray(cartResponse.data)) {
        this.testResults.cartRetrieval = true;
        console.log(`✅ Cart retrieval successful (${cartResponse.data.length} items)`);
      }

      // Test order creation
      console.log('📦 Testing Order Creation...');
      const orderData = {
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Customer',
          address: '123 Test Street',
          city: 'Casablanca',
          postalCode: '20000',
          country: 'Morocco'
        },
        paymentMethod: 'cash_on_delivery'
      };

      try {
        const orderResponse = await axios.post(`${API_BASE}/orders`, orderData, { headers, timeout: 5000 });
        if (orderResponse.data.success) {
          this.testResults.orderCreation = true;
          console.log('✅ Order creation successful');
          console.log(`   Order ID: ${orderResponse.data.order.id}`);
        }
      } catch (orderError) {
        console.log('⚠️ Order creation skipped:', orderError.response?.data?.message || orderError.message);
      }

    } catch (error) {
      console.log('❌ Cart flow failed:', error.message);
    }
  }

  async testAdminFlow() {
    if (!this.authToken) {
      console.log('⚠️ Skipping admin tests - no authentication token');
      return;
    }

    try {
      console.log('👨‍💼 Testing Admin Panel Access...');

      const headers = { Authorization: `Bearer ${this.authToken}` };

      // Test admin products
      try {
        const adminProductsResponse = await axios.get(`${API_BASE}/admin/products`, { headers, timeout: 5000 });
        if (adminProductsResponse.data) {
          this.testResults.adminProducts = true;
          console.log('✅ Admin products access successful');
        }
      } catch (adminError) {
        console.log('⚠️ Admin products test skipped:', adminError.response?.status);
      }

      // Test admin orders
      try {
        const adminOrdersResponse = await axios.get(`${API_BASE}/admin/orders`, { headers, timeout: 5000 });
        if (adminOrdersResponse.data) {
          this.testResults.adminOrders = true;
          console.log('✅ Admin orders access successful');
        }
      } catch (adminError) {
        console.log('⚠️ Admin orders test skipped:', adminError.response?.status);
      }

      this.testResults.adminLogin = this.testResults.adminProducts || this.testResults.adminOrders;

    } catch (error) {
      console.log('❌ Admin flow failed:', error.message);
    }
  }

  displayResults() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 E-COMMERCE FLOW TEST RESULTS');
    console.log('=' .repeat(60));

    const passed = Object.values(this.testResults).filter(result => result === true).length;
    const total = Object.keys(this.testResults).length;

    console.log(`\n🎯 Overall Score: ${passed}/${total} tests passed\n`);

    const sections = {
      '🔧 Core API': ['healthCheck', 'productListing', 'productDetail'],
      '👤 User Flow': ['userRegistration', 'userLogin', 'addToCart', 'cartRetrieval', 'orderCreation'],
      '👨‍💼 Admin Panel': ['adminLogin', 'adminProducts', 'adminOrders']
    };

    Object.entries(sections).forEach(([sectionName, tests]) => {
      console.log(`${sectionName}:`);
      tests.forEach(test => {
        const status = this.testResults[test] ? '✅' : '❌';
        const name = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        console.log(`  ${status} ${name}`);
      });
      console.log('');
    });

    console.log('🌐 Frontend Access:');
    console.log(`  🛒 Main Store: ${CLIENT_BASE}`);
    console.log(`  👨‍💼 Admin Panel: ${CLIENT_BASE}/admin`);

    console.log('\n🔐 Admin Credentials:');
    console.log('  📧 Email: admin@drogueriejamal.ma');
    console.log('  🔑 Password: DroguerieJamal2024!SecureAdmin');

    if (passed === total) {
      console.log('\n🎉 ALL TESTS PASSED! Your e-commerce platform is fully functional!');
    } else if (passed >= total * 0.7) {
      console.log('\n✅ Most tests passed! Platform is largely functional with minor issues.');
    } else {
      console.log('\n⚠️ Some core functionality needs attention before production.');
    }

    console.log('=' .repeat(60));
  }
}

async function main() {
  const tester = new EcommerceFlowTester();
  await tester.runAllTests();
}

if (require.main === module) {
  main();
}

module.exports = EcommerceFlowTester;
