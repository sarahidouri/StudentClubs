import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      
    },
    location: String,
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['going', 'interested', 'declined'],
          default: 'interested',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    capacity: {
      type: Number,
      default: 0,
    },
    registrationDeadline: Date,
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
