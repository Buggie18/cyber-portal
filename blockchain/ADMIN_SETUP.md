# Admin Setup Guide

This guide explains how to set up admin users who can add policies, while regular users are restricted from adding policies.

## Overview

The system now enforces role-based access control:
- **Admin users**: Can add, view, and manage policies
- **Regular users**: Can only view policies (cannot add new ones)

## Database Setup

### 1. Update Existing Database

If you already have a database with users, run the migration SQL to add the `role` column:

```sql
-- This is automatically included in init.sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
```

Or simply re-run `init.sql` which includes the migration.

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

## Files Modified

1. `backend/init.sql` - Added `role` column to users table
2. `backend/routes/policies.js` - Added `requireAdmin` middleware
3. `backend/routes/auth.js` - Updated registration to set default role
4. `backend/scripts/make-admin.js` - Script to promote users to admin
5. `backend/scripts/make-admin.sql` - SQL script to promote users to admin
