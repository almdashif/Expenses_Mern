

import { Router } from 'express';
import { transactions } from '../Controllers/transactions.js';

const router = Router();

router.get('/', transactions);

export default router;
