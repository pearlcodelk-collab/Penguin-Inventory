# 🐧 Penguin Inventory Management System - Authentication Setup

## ✅ Implementation Complete

A complete login and user management system has been successfully implemented for the Penguin Toys & Novelties Inventory Management System.

---

## 🎯 Features Implemented

### **Backend**
- ✅ User Model with password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Role-based access control (Super Admin & User)
- ✅ Protected API routes with middleware
- ✅ User CRUD operations (Create, Read, Update, Delete/Deactivate)
- ✅ Password change functionality for all users
- ✅ Super admin seeding script

### **Frontend**
- ✅ Beautiful login page with Penguin branding
- ✅ User management dashboard (Super Admin only)
- ✅ Protected routes with authentication
- ✅ Auth context for global state management
- ✅ Role-based sidebar menu
- ✅ User profile display in navbar with logout
- ✅ Responsive design for mobile and desktop

---

## 🚀 Setup Instructions

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)
- npm or yarn package manager

### **Step 1: Install Dependencies**

#### Backend
```powershell
cd backend
npm install
```

#### Frontend
```powershell
cd frontend
npm install
```

### **Step 2: Environment Configuration**

The `.env` file in the backend is already configured with:
- MongoDB Atlas connection string
- JWT secret key
- Super admin default credentials

**Default Super Admin Credentials:**
- Email: `superadmin@penguin.com`
- Password: `Penguin@123`

### **Step 3: Seed Super Admin Account**

Run this command to create the initial super admin account in the database:

```powershell
cd backend
npm run seed:superadmin
```

You should see:
```
✅ Super admin created successfully!
==========================================
Email: superadmin@penguin.com
Password: Penguin@123
==========================================
Please login and change the password immediately!
```

**Note:** If super admin already exists, the script will notify you and skip creation.

### **Step 4: Start the Backend Server**

```powershell
cd backend
npm start
```

Backend will run on: `http://localhost:3000`

### **Step 5: Start the Frontend Development Server**

Open a new terminal:

```powershell
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173` (or another port if 5173 is busy)

---

## 🔐 Using the System

### **First Login - Super Admin**

1. Open your browser and navigate to the frontend URL
2. Click "Get Started" or navigate to `/login`
3. Click on "Admin Login" tab
4. Enter credentials:
   - Email: `superadmin@penguin.com`
   - Password: `Penguin@123`
5. Click "Login"

### **Change Super Admin Password (Recommended)**

1. After logging in, go to "User Management" from the sidebar
2. Click "Change Password" button in the top right
3. Enter:
   - Current Password: `Penguin@123`
   - New Password: Your secure password
   - Confirm New Password: Repeat your secure password
4. Click "Change Password"

### **Create New Users**

1. Go to "User Management" (visible only to Super Admin)
2. Click "Add User" button
3. Fill in the form:
   - Full Name
   - Username
   - Email
   - Password
   - Role (User or Super Admin)
4. Click "Create User"

### **Regular User Login**

1. Navigate to `/login`
2. Stay on "User Login" tab (default)
3. Enter the credentials created by Super Admin
4. Click "Login"

---

## 📁 Project Structure

### **Backend**
```
backend/
├── configs/
│   └── db.js                 # MongoDB connection
├── controllers/
│   └── userController.js      # User CRUD & auth logic
├── middleware/
│   └── auth.js               # JWT verification & RBAC
├── models/
│   └── userModel.js          # User schema with password hashing
├── routes/
│   └── userRoute.js          # User API routes
├── utils/
│   └── seedSuperAdmin.js     # Super admin seeding script
├── .env                      # Environment variables
├── server.js                 # Express server setup
└── package.json
```

### **Frontend**
```
frontend/src/
├── components/
│   ├── Navbar.jsx            # Updated with auth features
│   ├── Sidebar.jsx           # Updated with role-based menu
│   └── ProtectedRoute.jsx    # Route protection wrapper
├── context/
│   └── AuthContext.jsx       # Global auth state management
├── pages/
│   ├── Login.jsx             # Login page
│   ├── UserManagement.jsx    # User management dashboard
│   └── ... (other pages)
├── services/
│   ├── api.js                # Axios configuration
│   ├── authService.js        # Authentication API calls
│   └── userService.js        # User management API calls
├── App.jsx                   # Updated with protected routes
└── main.jsx                  # Updated with AuthProvider
```

---

## 🔑 API Endpoints

### **Authentication**
- `POST /api/users/super-admin/login` - Super admin login
- `POST /api/users/login` - Regular user login

### **User Management** (Protected - Super Admin Only)
- `POST /api/users/create` - Create new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### **Password Management** (Protected - All Users)
- `PUT /api/users/change-password` - Change password

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication (24-hour expiration)
- ✅ Protected API routes with middleware
- ✅ Role-based access control (RBAC)
- ✅ Automatic token refresh handling
- ✅ Soft delete (user deactivation)
- ✅ Input validation on frontend and backend
- ✅ Secure password requirements (minimum 6 characters)

---

## 👥 User Roles

### **Super Admin**
- Full system access
- Can create, view, edit, and deactivate users
- Can access User Management page
- Can change own password
- Cannot be deactivated

### **User**
- Access to inventory management features
- Can change own password
- Cannot access User Management
- Can be deactivated by Super Admin

---

## 🎨 UI Features

### **Login Page**
- Beautiful animated background
- Toggle between User and Admin login
- Form validation
- Error messaging
- Responsive design

### **User Management**
- Search and filter users
- Create user modal with form validation
- Edit user details
- Deactivate users (soft delete)
- Change password functionality
- Visual indicators for user status and roles
- Responsive data table

### **Navigation**
- User profile display with avatar
- Role badge (Super Admin/User)
- Logout functionality
- Role-based menu items (User Management for admins only)

---

## 🧪 Testing Checklist

- [ ] Super admin can login with default credentials
- [ ] Super admin can change password
- [ ] Super admin can create new users
- [ ] Super admin can view all users
- [ ] Super admin can edit user details
- [ ] Super admin can deactivate users
- [ ] Regular users can login with created credentials
- [ ] Users cannot access User Management page
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout clears session and redirects to login
- [ ] Token expiration works correctly (24 hours)

---

## 🚨 Important Notes

1. **Change Default Password**: After first login, immediately change the super admin password!

2. **Database**: Make sure your MongoDB Atlas cluster is accessible and the connection string in `.env` is correct.

3. **Port Conflicts**: If port 3000 or 5173 is in use, you can change them:
   - Backend: Update `PORT` in `.env`
   - Frontend: Vite will automatically use another port

4. **CORS**: The backend is configured to accept requests from any origin. In production, update CORS settings in `server.js` to only allow your frontend domain.

5. **JWT Secret**: The current JWT_SECRET is for development. Generate a strong random secret for production:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB Atlas connection string is correct
- Ensure all dependencies are installed: `npm install`
- Check if port 3000 is available

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:3000`
- Check API_BASE_URL in `frontend/src/services/api.js`
- Check browser console for CORS errors

### Super admin seeding fails
- Ensure MongoDB connection is working
- Check if super admin already exists (script will notify)
- Verify .env variables are set correctly

### Login fails
- Verify backend is running
- Check credentials are correct
- Check browser console for error messages
- Verify user exists and is active in database

---

## 📧 Support

For issues or questions about this implementation, please contact the development team.

---

## 🎉 You're All Set!

Your Penguin Inventory Management System now has a complete authentication and user management system. Start by creating the super admin account, login, change the password, and then create users for your team!

**Happy Inventory Managing! 🐧📦**
