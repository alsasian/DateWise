import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  addActivity,
  removeActivity,
  updateActivity,
  updateProfileValidation,
} from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';
import { validate, runValidation } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/profile - Get current user's profile
router.get('/', getProfile);

// PUT /api/profile - Update profile
router.put('/', runValidation(updateProfileValidation), validate, updateProfile);

// POST /api/profile/activities - Add activity preference
router.post('/activities', addActivity);

// PUT /api/profile/activities/:id - Update activity preference
router.put('/activities/:id', updateActivity);

// DELETE /api/profile/activities/:id - Remove activity preference
router.delete('/activities/:id', removeActivity);

export default router;
