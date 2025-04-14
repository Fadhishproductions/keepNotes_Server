import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import noteRoutes from './routes/noteRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errorMiddleware.js';

dotenv.config();  
const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(express.json());
app.use(cookieParser()) 
connectDb();  

app.use('/api/notes',noteRoutes)
app.use('/api/auth', authRoutes);

//Error handling middleware
app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));