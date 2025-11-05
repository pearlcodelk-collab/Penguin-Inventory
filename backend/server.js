import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRoute from "./routes/userRoute.js";
import categoryRoute from "./routes/categoryRoute.js";

// Initialize Express App
const app = express()

//connect Database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res)=> res.send("Penguin Inventory Management System - Server is Running"))
app.use('/api/users', userRoute);
app.use('/api/categories', categoryRoute);

// Test endpoint to verify category routes are loaded
app.get('/api/test-categories', (req, res) => {
  res.json({ 
    message: 'Category routes are registered',
    routes: ['GET /api/categories', 'POST /api/categories', 'PUT /api/categories/:id', 'DELETE /api/categories/:id']
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))