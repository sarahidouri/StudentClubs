version: 1.0.0

# StudentClubs Architecture Overview

## System Design

### Components
1. **Frontend (React + Tailwind CSS)**
   - Vite build system
   - Socket.io real-time features
   - Responsive design

2. **Backend (Express + Node.js)**
   - RESTful API
   - Socket.io server
   - JWT authentication

3. **Database (MongoDB)**
   - Document-based
   - Flexible schema
   - Indexing for performance

4. **Services**
   - Cloudinary: Image management
   - Nodemailer: Email notifications
   - Google OAuth: Social authentication

## Data Flow

### Authentication Flow
User → Login → JWT Token → Stored in localStorage → Sent in requests

### Real-time Communication
Client ← Socket.io → Server → Broadcast to relevant users

### API Request Flow
Client → Axios → Express Router → Controller → Service → Database → Response

## Deployment Architecture

```
┌─────────────┐
│   Client    │ (Port 3000)
│ React/Vite  │
└──────┬──────┘
       │
       │ HTTP/WebSocket
       │
┌──────▼──────┐
│   Server    │ (Port 5000)
│ Express     │
└──────┬──────┘
       │
       │
┌──────▼──────┐
│  MongoDB    │ (Port 27017)
│ Database    │
└─────────────┘
```

## Scalability Considerations

1. **Horizontal Scaling**
   - Multiple backend instances
   - Load balancer (nginx)
   - MongoDB replication

2. **Caching Layer**
   - Redis for session storage
   - Response caching

3. **CDN**
   - Cloudinary for images
   - Static assets on CDN

## Security Architecture

```
Client Request
    ↓
HTTPS Layer
    ↓
Rate Limiter
    ↓
CORS Validation
    ↓
Authentication (JWT)
    ↓
Authorization (Role)
    ↓
Input Validation
    ↓
Business Logic
    ↓
Response Encryption
```

## Database Schema

### Relationships
- User (1) ← → (Many) Club
- User (1) ← → (Many) Event
- User (1) ← → (Many) Post
- Club (1) ← → (Many) Event
- Club (1) ← → (Many) Post
- Post (1) ← → (Many) Comment
- User (1) ← → (Many) Message

### Indexes
- User: email, googleId
- Club: name, manager
- Event: club, startDate
- Post: club, author
- Message: sender, receiver, createdAt
