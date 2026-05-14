import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { configureSocket } from './sockets/socketConfig.js';
import connectDB from './config/database.js';
import { configureCloudinary } from './config/cloudinary.js';
import { errorHandler } from './middleware/errorHandler.js';
import {
  helmetMiddleware,
  morganMiddleware,
  compressionMiddleware,
  limiter,
} from './middleware/securityMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Configure Socket.io
configureSocket(server);

// Connect to database
await connectDB();

// Configure Cloudinary
configureCloudinary();

// Middleware
app.use(helmetMiddleware);
app.use(morganMiddleware);
app.use(compressionMiddleware);
app.use(limiter);
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  CampusConnect Server Started 🚀      ║
║  Environment: ${process.env.NODE_ENV}        
║  Port: ${PORT}
║  URL: http://localhost:${PORT}
╚════════════════════════════════════════╝
  `);
});

export default app;
