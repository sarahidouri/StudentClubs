import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'event_invitation',
        'new_post',
        'event_reminder',
        'member_joined',
        'club_update',
        'message',
        'comment',
        'like',
      ],
      required: true,
    },
    title: String,
    message: String,
    link: String,
    relatedEntity: {
      entityType: String,
      entityId: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
