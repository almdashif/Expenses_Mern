import { Router } from 'express';
import { getAllUser, getUser } from '../Controllers/user.js';
import { isAdmin, isValidUser, verifyToken } from '../Middlewares/authMiddleware.js';

const router = Router();

// Route to get all users (Admin only)
router.get('/all', isValidUser, isAdmin, verifyToken, getAllUser);

// Route to get specific user (Valid user or Admin)
router.get('/:id', isValidUser, getUser);

export default router;
