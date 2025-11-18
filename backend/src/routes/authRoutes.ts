import { Router } from 'express';
import { register, login, getCurrentUser, registerValidation, loginValidation } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate, runValidation } from '../middleware/validation';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', runValidation(registerValidation), validate, register);

// POST /api/auth/login - Login user
router.post('/login', runValidation(loginValidation), validate, login);

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, getCurrentUser);

export default router;
