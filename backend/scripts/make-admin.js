// Script to make a user admin via Node.js
// Usage: node scripts/make-admin.js <username>
// Example: node scripts/make-admin.js admin

const { pool } = require('../db');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function makeAdmin(username) {
  try {
    // Check if user exists
    const checkResult = await pool.query(
      'SELECT id, username, role FROM users WHERE username = $1',
      [username]
    );

    if (checkResult.rows.length === 0) {
      console.error(`❌ User "${username}" not found.`);
      process.exit(1);
    }

    const user = checkResult.rows[0];
    
    if (user.role === 'admin') {
      console.log(`ℹ️  User "${username}" is already an admin.`);
      process.exit(0);
    }

    // Update user to admin
    await pool.query(
      'UPDATE users SET role = $1 WHERE username = $2',
      ['admin', username]
    );

    console.log(`✅ Successfully made "${username}" an admin!`);
    
    // Verify
    const verifyResult = await pool.query(
      'SELECT id, username, role FROM users WHERE username = $1',
      [username]
    );
    console.log('Updated user:', verifyResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get username from command line argument
const username = process.argv[2];

if (!username) {
  console.error('❌ Usage: node scripts/make-admin.js <username>');
  console.error('   Example: node scripts/make-admin.js admin');
  process.exit(1);
}

makeAdmin(username);
