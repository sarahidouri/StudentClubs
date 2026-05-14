import { clubService } from '../services/clubService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activityLogger.js';
import { paginate } from '../utils/queryHelpers.js';

export const createClubController = asyncHandler(async (req, res) => {
  const club = await clubService.createClub(req.body, req.userId);

  await logActivity(
    req.userId,
    'create',
    'club',
    club._id,
    `Created club: ${club.name}`,
    req
  );

  res.status(201).json({
    success: true,
    message: 'Club created successfully',
    data: club,
  });
});

export const getClubController = asyncHandler(async (req, res) => {
  const club = await clubService.getClubById(req.params.id);

  if (!club) {
    return res.status(404).json({
      success: false,
      message: 'Club not found',
    });
  }

  res.json({
    success: true,
    message: 'Club retrieved',
    data: club,
  });
});

export const updateClubController = asyncHandler(async (req, res) => {
  const club = await clubService.updateClub(req.params.id, req.body);

  if (!club) {
    return res.status(404).json({
      success: false,
      message: 'Club not found',
    });
  }

  await logActivity(
    req.userId,
    'update',
    'club',
    club._id,
    `Updated club: ${club.name}`,
    req
  );

  res.json({
    success: true,
    message: 'Club updated successfully',
    data: club,
  });
});

export const getAllClubsController = asyncHandler(async (req, res) => {
  const pagination = paginate(req.query);
  const { category, search, isActive } = req.query;

  const result = await clubService.getAllClubs(
    { category, search, isActive: isActive === 'true' },
    pagination
  );

  res.json({
    success: true,
    message: 'Clubs retrieved',
    data: result,
  });
});

export const joinClubController = asyncHandler(async (req, res) => {
  const club = await clubService.joinClub(req.params.id, req.userId);

  await logActivity(
    req.userId,
    'join',
    'club',
    club._id,
    `Joined club: ${club.name}`,
    req
  );

  res.json({
    success: true,
    message: 'Joined club successfully',
    data: club,
  });
});

export const leaveClubController = asyncHandler(async (req, res) => {
  const club = await clubService.leaveClub(req.params.id, req.userId);

  await logActivity(
    req.userId,
    'leave',
    'club',
    club._id,
    `Left club: ${club.name}`,
    req
  );

  res.json({
    success: true,
    message: 'Left club successfully',
    data: club,
  });
});

export const updateMemberRoleController = asyncHandler(async (req, res) => {
  const { memberId, newRole } = req.body;
  const club = await clubService.updateMemberRole(req.params.id, memberId, newRole);

  res.json({
    success: true,
    message: 'Member role updated',
    data: club,
  });
});
