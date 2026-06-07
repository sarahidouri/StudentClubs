import express from 'express';
import {
  createClubController,
  getClubController,
  updateClubController,
  getAllClubsController,
  joinClubController,
  leaveClubController,
  updateMemberRoleController,
} from '../controllers/clubController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { optionalAuth } from '../middleware/authMiddleware.js';
import { authorizeClubManager } from '../middleware/roleMiddleware.js';

const router = express.Router();


router.get('/', optionalAuth, getAllClubsController);
router.get('/:id', optionalAuth, getClubController);


router.post('/', authMiddleware, authorizeClubManager, createClubController);
router.put('/:id', authMiddleware, authorizeClubManager, updateClubController);
router.post('/:id/join', authMiddleware, joinClubController);
router.post('/:id/leave', authMiddleware, leaveClubController);
router.put('/:id/member-role', authMiddleware, authorizeClubManager, updateMemberRoleController);

export default router;
