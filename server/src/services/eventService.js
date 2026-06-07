import Event from '../models/Event.js';
import User from '../models/User.js';

export const eventService = {
  async createEvent(eventData, clubId, userId) {
    const event = new Event({
      ...eventData,
      club: clubId,
      createdBy: userId,
      attendees: [
        {
          user: userId,
          status: 'going',
        },
      ],
    });

    return await event.save();
  },

  async getEventById(eventId) {
    return await Event.findById(eventId)
      .populate('club', 'name logo')
      .populate('createdBy', 'firstName lastName email')
      .populate('attendees.user', 'firstName lastName profileImage');
  },

  async updateEvent(eventId, updateData) {
    const allowedUpdates = [
      'title',
      'description',
      'startDate',
      'endDate',
      'location',
      'thumbnail',
      'capacity',
      'registrationDeadline',
      'status',
      'tags',
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    return await Event.findByIdAndUpdate(eventId, updates, { new: true });
  },

  async getAllEvents(filters = {}, pagination) {
    const query = {};
    if (filters.club) query.club = filters.club;
    if (filters.status) query.status = filters.status;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('club', 'name logo')
      .populate('createdBy', 'firstName lastName')
      .limit(pagination.limit)
      .skip(pagination.skip)
      .sort({ startDate: 1 });

    const total = await Event.countDocuments(query);

    return {
      events,
      total,
      pages: Math.ceil(total / pagination.limit),
    };
  },

  async registerForEvent(eventId, userId, status = 'going') {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    const attendeeIndex = event.attendees.findIndex(
      (a) => a.user.toString() === userId
    );

    if (attendeeIndex >= 0) {
      event.attendees[attendeeIndex].status = status;
    } else {
      event.attendees.push({ user: userId, status });
    }

    const updatedEvent = await event.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredEvents: updatedEvent._id },
    });

    return updatedEvent;
  },

  async cancelEventRegistration(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    event.attendees = event.attendees.filter((a) => a.user.toString() !== userId);
    const updatedEvent = await event.save();

    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEvents: updatedEvent._id },
    });

    return updatedEvent;
  },
};
