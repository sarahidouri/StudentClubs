import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
      enum: [
        'create',
        'update',
        'delete',
        'join',
        'leave',
        'post',
        'comment',
        'like',
        'login',
        'logout',
      ],
      required: true,
    },
    entityType: {
      type: String,
      enum: ['user', 'club', 'event', 'post', 'message', 'report'],
    },
    entityId: mongoose.Schema.Types.ObjectId,
    description: String,
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    details: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
