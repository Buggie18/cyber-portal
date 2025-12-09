// Script to add role column to existing users table
// Usage: node scripts/add-role-column.js

const { pool } = require('../db');

async function addRoleColumn() {
  try {
    console.log('Checking if role column exists...');
    
    // Check if column exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✅ Role column already exists.');
      return;
    }

    console.log('Adding role column to users table...');
    
    // Add the role column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN role TEXT DEFAULT 'user' 
      CHECK (role IN ('user', 'admin'))
    `);

    // Update existing users to have 'user' role (in case default didn't apply)
    await pool.query(`
      UPDATE users 
      SET role = 'user' 
      WHERE role IS NULL
    `);

    console.log('✅ Successfully added role column!');
    console.log('   All existing users have been set to "user" role.');
    console.log('   Use make-admin.js to promote users to admin.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addRoleColumn().then(() => {
  process.exit(0);
});
