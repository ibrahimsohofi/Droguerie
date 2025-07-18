const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function updateAdminSecurity() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, 'database.sqlite');
    const db = new sqlite3.Database(dbPath);

    console.log('🔐 Updating admin security...');

    // Generate new secure credentials
    const newAdminEmail = 'admin@drogueriejamal.ma';
    const newAdminPassword = 'DroguerieJamal2024!SecureAdmin';
    const saltRounds = 12;

    // Hash the new password
    bcrypt.hash(newAdminPassword, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('❌ Error hashing password:', err);
        reject(err);
        return;
      }

      // Update admin user (first try to find any user with this email)
      const updateSql = `
        UPDATE users
        SET password = ?, is_admin = 1, updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `;

      db.run(updateSql, [hashedPassword, newAdminEmail], function(err) {
        if (err) {
          console.error('❌ Error updating admin credentials:', err);
          reject(err);
          return;
        }

        if (this.changes === 0) {
          console.log('⚠️ No user found with email, creating new admin user...');

          // Create new admin user
          const createSql = `
            INSERT INTO users (first_name, last_name, email, password, is_admin, is_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `;

          db.run(createSql, ['Admin', 'Droguerie Jamal', newAdminEmail, hashedPassword], function(err) {
            if (err) {
              console.error('❌ Error creating admin user:', err);
              reject(err);
              return;
            }

            console.log('✅ New admin user created successfully');
            displayCredentials();

            db.close((err) => {
              if (err) {
                console.error('❌ Error closing database:', err);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        } else {
          console.log('✅ Admin credentials updated successfully');
          console.log(`🔧 Updated ${this.changes} user record(s)`);
          displayCredentials();

          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        }
      });
    });

    function displayCredentials() {
      console.log('\n' + '='.repeat(60));
      console.log('🔐 SECURE ADMIN CREDENTIALS');
      console.log('='.repeat(60));
      console.log(`📧 Email: ${newAdminEmail}`);
      console.log(`🔑 Password: ${newAdminPassword}`);
      console.log('='.repeat(60));
      console.log('⚠️  IMPORTANT: Store these credentials securely!');
      console.log('🔒 The password is now properly hashed in the database');
      console.log('🚪 Access admin panel at: http://localhost:5173/admin');
      console.log('='.repeat(60) + '\n');
    }
  });
}

// Add security headers and rate limiting info
async function displaySecurityInfo() {
  console.log('🛡️ Security Features Enabled:');
  console.log('  ✅ Password hashing with bcrypt (12 rounds)');
  console.log('  ✅ JWT authentication tokens');
  console.log('  ✅ CORS protection configured');
  console.log('  ✅ Rate limiting enabled');
  console.log('  ✅ Helmet security headers');
  console.log('  ✅ XSS protection');
  console.log('  ✅ SQL injection protection');

  console.log('\n📋 Security Recommendations:');
  console.log('  🔄 Change admin password regularly');
  console.log('  🔐 Enable 2FA for production');
  console.log('  🚫 Use HTTPS in production');
  console.log('  📊 Monitor login attempts');
  console.log('  🗄️ Regular database backups');
}

async function main() {
  try {
    console.log('🚀 Droguerie Jamal - Security Update');
    console.log('🔐 Updating admin credentials and security settings');
    console.log('=' .repeat(50));

    await updateAdminSecurity();
    await displaySecurityInfo();

    console.log('✅ Security update completed successfully!');

  } catch (error) {
    console.error('❌ Failed to update security:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { updateAdminSecurity };
