import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './database/db.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();
await connectDB();
const app=express();
const port=process.env.PORT || 5000;
// middleware
app.use(express.json());

//http://localhost:5000/api/v1/user/register
app.use('/api/v1/user', userRoutes);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

