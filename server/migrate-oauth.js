const { db } = require('./config/db');

// Migration to add OAuth fields to users table
const addOAuthFields = () => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Adding OAuth fields to users table...');

    db.serialize(() => {
      // Add google_id column
      db.run(`ALTER TABLE users ADD COLUMN google_id TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding google_id column:', err.message);
        } else {
          console.log('✅ Added google_id column');
        }
      });

      // Add facebook_id column
      db.run(`ALTER TABLE users ADD COLUMN facebook_id TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding facebook_id column:', err.message);
        } else {
          console.log('✅ Added facebook_id column');
        }
      });

      // Add avatar_url column
      db.run(`ALTER TABLE users ADD COLUMN avatar_url TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Error adding avatar_url column:', err.message);
          reject(err);
        } else {
          console.log('✅ Added avatar_url column');
          console.log('✅ OAuth migration completed successfully');
          resolve();
        }
      });
    });
  });
};

// Run migration if called directly
if (require.main === module) {
  addOAuthFields()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { addOAuthFields };
