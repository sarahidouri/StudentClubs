import { messageService } from '../services/messageService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { paginate } from '../utils/queryHelpers.js';

export const sendMessageController = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage({
    ...req.body,
    sender: req.userId,
  });

  res.status(201).json({
    success: true,
    message: 'Message sent',
    data: message,
  });
});

export const getDirectMessagesController = asyncHandler(async (req, res) => {
  const { otherId } = req.params;
  const pagination = paginate(req.query);

  const messages = await messageService.getDirectMessages(
    req.userId,
    otherId,
    pagination
  );

  res.json({
    success: true,
    message: 'Messages retrieved',
    data: messages,
  });
});

export const getClubMessagesController = asyncHandler(async (req, res) => {
  const { clubId } = req.params;
  const pagination = paginate(req.query);

  const messages = await messageService.getClubMessages(clubId, pagination);

  res.json({
    success: true,
    message: 'Club messages retrieved',
    data: messages,
  });
});

export const markMessagesAsReadController = asyncHandler(async (req, res) => {
  const { messageIds } = req.body;

  await messageService.markAsRead(messageIds);

  res.json({
    success: true,
    message: 'Messages marked as read',
  });
});

export const deleteMessageController = asyncHandler(async (req, res) => {
  const message = await messageService.deleteMessage(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found',
    });
  }

  res.json({
    success: true,
    message: 'Message deleted',
  });
});
