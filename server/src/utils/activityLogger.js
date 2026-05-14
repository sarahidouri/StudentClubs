import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (
  userId,
  action,
  entityType,
  entityId,
  description,
  req
) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      entityType,
      entityId,
      description,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const getActivityLog = async (filters, pagination) => {
  return await ActivityLog.find(filters)
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(pagination.limit)
    .skip(pagination.skip);
};
