// index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { db } from './src/DB/db.js';
import router from './src/Routes/transaction.js';

const app = express();
let server = process.env.server || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', router);  

db().then(() => {
  app.listen(server, () => {
    console.log(`Server is running on port ${server}`);
  });
});
