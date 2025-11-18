import { Router } from 'express';
import {
  getDatePlan,
  updateDatePlan,
  submitFeedback,
  getPastDates,
} from '../controllers/datePlanController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/date-plans/past - Get past dates
router.get('/past', getPastDates);

// GET /api/date-plans/:matchId - Get date plan for a match
router.get('/:matchId', getDatePlan);

// PUT /api/date-plans/:matchId - Update date plan
router.put('/:matchId', updateDatePlan);

// POST /api/date-plans/:matchId/feedback - Submit feedback
router.post('/:matchId/feedback', submitFeedback);

export default router;
