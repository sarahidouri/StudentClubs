export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action',
      });
    }
    next();
  };
};

export const authorizeAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

export const authorizeClubManager = (req, res, next) => {
  if (!['club_manager', 'admin'].includes(req.userRole)) {
    return res.status(403).json({
      success: false,
      message: 'Club manager or admin access required',
    });
  }
  next();
};
