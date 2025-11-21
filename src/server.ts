import Express = require("express");import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import expenseRoutes from './routes/expenses';
import categoryRoutes from './routes/categories';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'BudgetFlow API is running! 🚀' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});