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

  await logActivity(user._id, 'create', 'user', user._id, 'User registered', req);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token, refreshToken },
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token, refreshToken } = await userService.loginUser(email, password);

  await logActivity(user._id, 'login', 'user', user._id, 'User logged in', req);

  res.json({
    success: true,
    message: 'Login successful',
    data: { user, token, refreshToken },
  });
});

export const getProfileController = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.userId);

  res.json({
    success: true,
    message: 'Profile retrieved',
    data: user,
  });
});

export const updateProfileController = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.userId, req.body);

  await logActivity(req.userId, 'update', 'user', req.userId, 'Profile updated', req);

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
