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


router.post('/register', authLimiter, registerController);
router.post('/login', authLimiter, loginController);


router.get('/profile', authMiddleware, getProfileController);
router.put('/profile', authMiddleware, updateProfileController);


router.get('/users', authMiddleware, authorizeAdmin, getAllUsersController);

export default router;
