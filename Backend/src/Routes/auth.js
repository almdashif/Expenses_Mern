import { Router } from 'express';
import { signUp, login, logout } from '../Controllers/auth.js';
import { verifyToken } from '../Middlewares/authMiddleware.js';

const router = Router();

// Signup Route
router.post('/signup', signUp)
    .post('/login', login)
    .post('/logout', verifyToken, logout)

export default router;
