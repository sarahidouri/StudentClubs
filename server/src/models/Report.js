import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    reportedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    reason: {
      type: String,
      enum: [
        'spam',
        'harassment',
        'inappropriate_content',
        'fake_account',
        'other',
      ],
      required: true,
    },
    description: String,
    evidence: [String],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNotes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
