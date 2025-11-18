import { Router } from 'express';
import {
  getDailyMatches,
  expressInterest,
  getPendingInterests,
  getMutualMatches,
  getDashboard,
  createManualMatch,
  getPotentialMatches,
} from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/matches/dashboard - Get dashboard data
router.get('/dashboard', getDashboard);

// GET /api/matches/daily - Get today's matches
router.get('/daily', getDailyMatches);

// GET /api/matches/pending - Get pending interests
router.get('/pending', getPendingInterests);

// GET /api/matches/mutual - Get mutual matches
router.get('/mutual', getMutualMatches);

// POST /api/matches/:matchId/interest - Express interest (like/pass)
router.post('/:matchId/interest', expressInterest);

// Admin routes
// POST /api/matches/create - Create manual match (admin only)
router.post('/create', createManualMatch);

// GET /api/matches/potential/:userId - Get potential matches for user (admin)
router.get('/potential/:userId', getPotentialMatches);

export default router;
