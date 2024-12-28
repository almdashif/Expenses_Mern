

import { Router } from 'express';
import { allTransactionsCount, transactions } from '../Controllers/transactions.js';

const router = Router();

router.get('/', transactions).get('/count', allTransactionsCount);

export default router;
