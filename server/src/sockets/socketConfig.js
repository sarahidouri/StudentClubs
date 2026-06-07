import { Server } from 'socket.io';
import { verifyToken } from '../utils/tokenUtils.js';

const activeUsers = new Map();
const userRooms = new Map();

export const configureSocket = (server) => {
 const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✓ User connected: ${socket.userId} (${socket.id})`);

    
    activeUsers.set(socket.userId, {
      socketId: socket.id,
      connectedAt: new Date(),
    });

    
    io.emit('user-online', {
      userId: socket.userId,
      timestamp: new Date(),
    });

    
    socket.join(`user-${socket.userId}`);
    userRooms.set(socket.userId, `user-${socket.userId}`);

    
    socket.on('send-message', (data) => {
      const recipientRoom = `user-${data.receiverId}`;
      io.to(recipientRoom).emit('receive-message', {
        ...data,
        senderId: socket.userId,
        timestamp: new Date(),
      });
    });

    
    socket.on('join-club-chat', (clubId) => {
      socket.join(`club-${clubId}`);
      io.to(`club-${clubId}`).emit('user-joined-club', {
        userId: socket.userId,
        clubId,
        timestamp: new Date(),
      });
    });

    socket.on('club-message', (data) => {
      io.to(`club-${data.clubId}`).emit('receive-club-message', {
        ...data,
        senderId: socket.userId,
        timestamp: new Date(),
      });
    });

    
    socket.on('typing', (data) => {
      if (data.type === 'direct') {
        const recipientRoom = `user-${data.recipientId}`;
        io.to(recipientRoom).emit('user-typing', {
          senderId: socket.userId,
          recipientId: data.recipientId,
        });
      } else if (data.type === 'club') {
        io.to(`club-${data.clubId}`).emit('user-typing-club', {
          senderId: socket.userId,
          clubId: data.clubId,
        });
      }
    });

    socket.on('stop-typing', (data) => {
      if (data.type === 'direct') {
        const recipientRoom = `user-${data.recipientId}`;
        io.to(recipientRoom).emit('user-stop-typing', {
          senderId: socket.userId,
        });
      } else if (data.type === 'club') {
        io.to(`club-${data.clubId}`).emit('user-stop-typing-club', {
          senderId: socket.userId,
        });
      }
    });

    
    socket.on('send-notification', (data) => {
      const targetRoom = `user-${data.recipientId}`;
      io.to(targetRoom).emit('receive-notification', {
        ...data,
        timestamp: new Date(),
      });
    });

    
    socket.on('disconnect', () => {
      console.log(`✗ User disconnected: ${socket.userId}`);
      activeUsers.delete(socket.userId);
      userRooms.delete(socket.userId);

      io.emit('user-offline', {
        userId: socket.userId,
        timestamp: new Date(),
      });
    });
  });

  return io;
};

export const getActiveUsers = () => Array.from(activeUsers.keys());

export const isUserOnline = (userId) => activeUsers.has(userId);
