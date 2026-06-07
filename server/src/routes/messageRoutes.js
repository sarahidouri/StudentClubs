import express from 'express';
import {
  sendMessageController,
  getDirectMessagesController,
  getClubMessagesController,
  markMessagesAsReadController,
  deleteMessageController,
} from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', authMiddleware, sendMessageController);
router.get('/direct/:otherId', authMiddleware, getDirectMessagesController);
router.get('/club/:clubId', authMiddleware, getClubMessagesController);
router.put('/mark-read', authMiddleware, markMessagesAsReadController);
router.delete('/:id', authMiddleware, deleteMessageController);

export default router;
