import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [
      {
        url: String,
        type: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    messageType: {
      type: String,
      enum: ['direct', 'group', 'club'],
      default: 'direct',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
