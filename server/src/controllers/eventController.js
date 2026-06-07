import { eventService } from '../services/eventService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logActivity } from '../utils/activityLogger.js';
import { paginate } from '../utils/queryHelpers.js';

export const createEventController = asyncHandler(async (req, res) => {
  
  const clubId = req.params.clubId || req.body.clubId;
  const event = await eventService.createEvent(req.body, clubId, req.userId);

  await logActivity(
    req.userId,
    'create',
    'event',
    event._id,
    `Created event: ${event.title}`,
    req
  );

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event,
  });
});

export const getEventController = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  res.json({
    success: true,
    message: 'Event retrieved',
    data: event,
  });
});

export const updateEventController = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  await logActivity(
    req.userId,
    'update',
    'event',
    event._id,
    `Updated event: ${event.title}`,
    req
  );

  res.json({
    success: true,
    message: 'Event updated successfully',
    data: event,
  });
});

export const getAllEventsController = asyncHandler(async (req, res) => {
  const pagination = paginate(req.query);
  const { club, status, search } = req.query;

  const result = await eventService.getAllEvents(
    { club, status, search },
    pagination
  );

  res.json({
    success: true,
    message: 'Events retrieved',
    data: result,
  });
});

export const registerEventController = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const event = await eventService.registerForEvent(
    req.params.id,
    req.userId,
    status
  );

  await logActivity(
    req.userId,
    'register',
    'event',
    event._id,
    `Registered for event: ${event.title}`,
    req
  );

  res.json({
    success: true,
    message: 'Event registration updated',
    data: event,
  });
});

export const cancelEventController = asyncHandler(async (req, res) => {
  const event = await eventService.cancelEventRegistration(req.params.id, req.userId);

  await logActivity(
    req.userId,
    'cancel',
    'event',
    event._id,
    `Cancelled event registration`,
    req
  );

  res.json({
    success: true,
    message: 'Event registration cancelled',
    data: event,
  });
});
