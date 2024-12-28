// index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { db } from './src/DB/db.js';
import incomeRouter from './src/Routes/income.js';
import expenseRouter from './src/Routes/expense.js';
import transactionsRouter from './src/Routes/transactions.js';
import authRouter from './src/Routes/auth.js';
import userRoutes from './src/Routes/user.js';
const app = express();
let server = process.env.server || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);
app.use('/transactions', transactionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRoutes);

db().then(() => {
  app.listen(server, () => {
    console.log(`Server is running on port ${server}`);
  });
});
