# 🚀 Quick Start Guide - Penguin Inventory System

## ⚡ Run the System in 3 Steps

### **Step 1: Create Super Admin Account**
Open terminal in backend folder:
```powershell
cd f:\company\Penguin-Inventory-main\backend
npm run seed:superadmin
```

### **Step 2: Start Backend Server**
In the same terminal:
```powershell
npm start
```
✅ Backend running on `http://localhost:3000`

### **Step 3: Start Frontend**
Open a new terminal:
```powershell
cd f:\company\Penguin-Inventory-main\frontend
npm run dev
```
✅ Frontend running on `http://localhost:5173`

---

## 🔐 Login Credentials

**Super Admin:**
- Email: `superadmin@penguin.com`
- Password: `Penguin@123`

⚠️ **Important:** Change password after first login!

---

## 📋 Quick Commands Reference

### Backend
```powershell
npm start                    # Start server
npm run seed:superadmin      # Create super admin (run once)
```

### Frontend
```powershell
npm run dev                  # Start development server
npm run build                # Build for production
npm run preview              # Preview production build
```

---

## ✅ Features You Can Use Now

### **Super Admin Can:**
- ✅ Login with admin credentials
- ✅ Create new users (with roles)
- ✅ View all users in system
- ✅ Edit user details
- ✅ Deactivate users
- ✅ Change own password
- ✅ Access all inventory features

### **Regular Users Can:**
- ✅ Login with assigned credentials
- ✅ Change own password
- ✅ Access inventory features (Dashboard, GRN Entry, etc.)
- ❌ Cannot access User Management

---

## 🎯 Test the System

1. **Access the application**: Open browser to `http://localhost:5173`
2. **Login as Super Admin**: Use credentials above
3. **Change Password**: Click "Change Password" in User Management
4. **Create a Test User**: Click "Add User" button
5. **Logout**: Click your profile → Sign Out
6. **Login as Regular User**: Use the credentials you created
7. **Verify Access**: Try accessing User Management (should redirect)

---

## 📞 Need Help?

See `AUTH_SETUP_GUIDE.md` for detailed documentation.

---

**Ready to manage your inventory! 🐧📦**
