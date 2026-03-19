# Admin Login Credentials

## Default Admin Account

The application automatically creates a default admin account on first startup.

### Login Credentials

- **Email:** `admin@supermart.com`
- **Password:** `Admin@123`

### Admin Login URL

- **Frontend URL:** `http://localhost:3001/` (Admin Login Page)
- **After login, you'll be redirected to:** `http://localhost:3001/admin`

---

## Changing Admin Credentials

To change the default admin email or password:

1. Open `backend/src/main/resources/application.properties`
2. Modify these properties:
   ```properties
   admin.email=your-new-email@example.com
   admin.password=YourNewPassword123
   ```
3. **Delete the existing admin account from the database** (or update it manually)
4. Restart the backend server - it will create a new admin with the updated credentials

---

## Security Features

✓ **Password Hashing:** All passwords are hashed using BCrypt before storage  
✓ **Automatic Admin Creation:** Admin account is created automatically on first startup  
✓ **Role-Based Access:** Users are assigned either CUSTOMER or ADMIN roles  
✓ **Secure Login:** Passwords are verified using BCrypt matching

---

## Troubleshooting

### "Invalid credentials" error
- Make sure you're using the correct email and password
- Check that the backend server is running on port 8081
- Verify the admin account exists in the database

### Admin account not created
- Check the backend console logs for initialization messages
- Ensure MySQL database is running and accessible
- Verify application.properties has the correct database credentials
