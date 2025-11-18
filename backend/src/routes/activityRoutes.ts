import { Router } from 'express';
import {
  getAllActivities,
  getActivitiesByCategory,
  getActivity,
  getPopularActivities,
} from '../controllers/activitiesController';

const router = Router();

// GET /api/activities - Get all activities (with optional filters)
router.get('/', getAllActivities);

// GET /api/activities/by-category - Get activities grouped by category
router.get('/by-category', getActivitiesByCategory);

// GET /api/activities/popular - Get popular activities
router.get('/popular', getPopularActivities);

// GET /api/activities/:id - Get single activity
router.get('/:id', getActivity);

export default router;
