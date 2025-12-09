# Admin Setup Guide

This guide explains how to set up admin users who can add policies, while regular users are restricted from adding policies.

## Overview

The system now enforces role-based access control:
- **Admin users**: Can add, view, and manage policies
- **Regular users**: Can only view policies (cannot add new ones)

## Database Setup

### 1. Update Existing Database

**Important**: Registration will work even without the `role` column (it falls back gracefully), but to enable admin functionality, you need to add the column.

If you already have a database with users, you have three options to add the `role` column:

#### Option A: Using Node.js Migration Script (Recommended)

```bash
cd backend
node scripts/add-role-column.js
```

This script will:
- Check if the column already exists
- Add the `role` column if it doesn't exist
- Set all existing users to 'user' role by default

#### Option B: Using SQL Directly

```sql
-- This is automatically included in init.sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
```

#### Option C: Re-run init.sql

The `init.sql` file includes a migration that will add the column if it doesn't exist.

### 2. Make a User Admin

You have two options to make a user admin:

#### Option A: Using SQL Script

1. Edit `backend/scripts/make-admin.sql`
2. Replace `'your_username'` with the actual username
3. Run the SQL script in your PostgreSQL database:

```bash
psql -U your_user -d your_database -f backend/scripts/make-admin.sql
```

Or directly in psql:
```sql
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

#### Option B: Using Node.js Script

```bash
cd backend
node scripts/make-admin.js <username>
```

Example:
```bash
node scripts/make-admin.js admin
```

## How It Works

### Backend Protection

The backend API route `/api/policies` (POST) now requires:
1. Valid JWT token (authentication)
2. User role must be `'admin'` (authorization)

If a non-admin user tries to add a policy, they'll receive:
```json
{
  "success": false,
  "error": "❌ Access denied. Admin role required to add policies."
}
```

### Frontend Protection

The frontend `PolicyForm` component checks `localStorage.getItem("role")` and only displays the form for admins. Non-admin users see:
> "You do not have permission to add policies."

## Testing

1. **Create a regular user**: Register through the UI (defaults to 'user' role)
2. **Make a user admin**: Use one of the methods above
3. **Login as admin**: The role is stored in localStorage and JWT token
4. **Try adding a policy as admin**: Should work ✅
5. **Try adding a policy as regular user**: Should be blocked ❌

## Security Notes

- The role is stored in the JWT token, so users need to log out and log back in after their role is changed
- The backend validates the role from the JWT token, not localStorage (which can be manipulated)
- Always verify admin status on the backend, never trust frontend checks alone

## Troubleshooting

### Registration Fails

If registration fails, it's likely because:
1. The database connection is not configured properly
2. The users table doesn't exist

**Note**: Registration will work even if the `role` column doesn't exist yet. The system will automatically fall back to the old schema.

### Users Can't Add Policies

If users can't add policies:
1. Make sure the `role` column exists (run `add-role-column.js`)
2. Make sure the user is set to 'admin' role (run `make-admin.js`)
3. Make sure the user logs out and logs back in after role change

## Files Modified

1. `backend/init.sql` - Added `role` column to users table with migration
2. `backend/routes/policies.js` - Added `requireAdmin` middleware
3. `backend/routes/auth.js` - Updated registration/login to handle role column gracefully
4. `backend/scripts/add-role-column.js` - Migration script to add role column
5. `backend/scripts/make-admin.js` - Script to promote users to admin
6. `backend/scripts/make-admin.sql` - SQL script to promote users to admin
