import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRoute from "./routes/userRoute.js";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))