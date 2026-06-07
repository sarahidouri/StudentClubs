import { userService } from '../services/userService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activityLogger.js';
import { paginate } from '../utils/queryHelpers.js';

export const registerController = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const { user, token, refreshToken } = await userService.registerUser({
    email,
    password,
    firstName,
    lastName,
  });

  
  logActivity(user._id, 'create', 'user', user._id, 'User registered', req).catch(console.error);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token, refreshToken },
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token, refreshToken } = await userService.loginUser(email, password);

  
  logActivity(user._id, 'login', 'user', user._id, 'User logged in', req).catch(console.error);

  res.json({
    success: true,
    message: 'Login successful',
    data: { user, token, refreshToken },
  });
});

export const getProfileController = asyncHandler(async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: 'User ID missing in request'
    });
  }

  const user = await userService.getUserById(req.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.json({
    success: true,
    data: user,
  });
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.userId, req.body);

  
  logActivity(req.userId, 'update', 'user', req.userId, 'Profile updated', req).catch(console.error);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const getAllUsersController = asyncHandler(async (req, res) => {
  const pagination = paginate(req.query);
  const { role, isActive } = req.query;

  const result = await userService.getAllUsers(
    { role, isActive: isActive === 'true' },
    pagination
  );

  res.json({
    success: true,
    message: 'Users retrieved',
    data: result,
  });
});
