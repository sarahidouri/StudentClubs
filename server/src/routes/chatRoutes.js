import express from 'express';
import { getUnreadCountController } from '../controllers/messageController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/unread-count', authMiddleware, getUnreadCountController);

export default router;
