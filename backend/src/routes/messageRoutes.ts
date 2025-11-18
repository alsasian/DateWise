import { Router } from 'express';
import { getMessages, sendMessage, getUnreadCount } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { body } from 'express-validator';
import { validate, runValidation } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/messages/unread - Get unread message count
router.get('/unread', getUnreadCount);

// GET /api/messages/:matchId - Get messages for a match
router.get('/:matchId', getMessages);

// POST /api/messages/:matchId - Send a message
router.post(
  '/:matchId',
  runValidation([body('message').trim().notEmpty().withMessage('Message required')]),
  validate,
  sendMessage
);

export default router;
