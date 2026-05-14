import express from 'express';
import {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  getAllUsersController,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/securityMiddleware.js';
import { authorize, authorizeAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, registerController);
router.post('/login', authLimiter, loginController);

// Protected routes
router.get('/profile', authMiddleware, getProfileController);
router.put('/profile', authMiddleware, updateProfileController);

// Admin routes
router.get('/users', authMiddleware, authorizeAdmin, getAllUsersController);

export default router;
