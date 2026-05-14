import Message from '../models/Message.js';

export const messageService = {
  async sendMessage(messageData) {
    const message = new Message(messageData);
    return await message.save();
  },

  async getDirectMessages(userId, otherId, pagination) {
    const messages = await Message.find({
      messageType: 'direct',
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId },
      ],
    })
      .populate('sender', 'firstName lastName profileImage')
      .populate('receiver', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(pagination.limit)
      .skip(pagination.skip);

    return messages.reverse();
  },

  async getClubMessages(clubId, pagination) {
    const messages = await Message.find({
      messageType: 'group',
      club: clubId,
    })
      .populate('sender', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(pagination.limit)
      .skip(pagination.skip);

    return messages.reverse();
  },

  async markAsRead(messageIds) {
    return await Message.updateMany(
      { _id: { $in: messageIds } },
      { isRead: true, readAt: new Date() }
    );
  },

  async deleteMessage(messageId) {
    return await Message.findByIdAndDelete(messageId);
  },
};
