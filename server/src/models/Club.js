import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['member', 'moderator', 'vice_president', 'president'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: String,
    meetingDay: String,
    meetingTime: String,
    contactEmail: String,
    website: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    memberCount: {
      type: Number,
      default: 0,
    },
    about: String,
    rules: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    featuredImage: String,
    tags: [String],
  },
  { timestamps: true }
);

clubSchema.pre('save', async function (next) {
  this.memberCount = this.members.length;
  next();
});

export default mongoose.model('Club', clubSchema);
