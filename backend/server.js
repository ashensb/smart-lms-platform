import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js'; 
import courseRoutes from './routes/courseRoutes.js'; 
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🗄️ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected Successfully! 🍃'))
    .catch((err) => console.error(err));

// 🛣️ API Routes Connection
app.use('/api/auth', authRoutes); 
app.use('/api/courses', courseRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('LMS Backend API is Running Successfully! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is happily running on port ${PORT} 🔥`));