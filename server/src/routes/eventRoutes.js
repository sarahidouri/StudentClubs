import express from 'express';
import {
  createEventController,
  getEventController,
  updateEventController,
  getAllEventsController,
  registerEventController,
  cancelEventController,
} from '../controllers/eventController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { authorizeClubManager } from '../middleware/roleMiddleware.js';

const router = express.Router();


router.get('/', optionalAuth, getAllEventsController);
router.get('/:id', optionalAuth, getEventController);


router.post('/club/:clubId', authMiddleware, authorizeClubManager, createEventController);
router.put('/:id', authMiddleware, authorizeClubManager, updateEventController);
router.post('/:id/register', authMiddleware, registerEventController);
router.post('/:id/cancel', authMiddleware, cancelEventController);

export default router;
