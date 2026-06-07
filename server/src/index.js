import './config/env.js';



import express from 'express';
import cors from 'cors';
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


import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();
const server = createServer(app);

try {
  
  configureSocket(server);
} catch (err) {
  console.error('❌ Socket.io configuration failed:', err.message);
}



try {
  await connectDB();
} catch (err) {
  console.error('❌ MongoDB Connection Failed:', err.message);
  console.log('T-akked beli MongoDB khaddam 3ndek (mongod)');
  process.exit(1);
}











configureCloudinary();


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


app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});


app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chat', chatRoutes);


app.get('/run-seed', async (req, res) => {
  try {
    await seedDatabase();
    res.send('Database seeded successfully via browser!');
  } catch (err) {
    console.error('Run-seed error:', err.message);
    res.status(500).send(err.message);
  }
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  StudentClubs Server Started 🚀        ║
║  Environment: ${process.env.NODE_ENV}        
║  Port: ${PORT}
║  URL: http://localhost:${PORT}
╚════════════════════════════════════════╝
  `);
});

export default app;
