# CampusConnect 🎓

A comprehensive MERN Stack application for managing university student clubs, events, and community engagement.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Contributing](#contributing)

## Features

### Core Features
- ✅ **User Authentication**: JWT-based authentication with Google OAuth integration
- ✅ **Role-based Access Control**: Student, Club Manager, and Admin roles
- ✅ **Club Management**: Create, manage, and join student clubs
- ✅ **Event Management**: Create, schedule, and manage campus events
- ✅ **Real-time Chat**: Socket.io-powered direct and group messaging
- ✅ **Notifications**: Real-time notifications for events, posts, and messages
- ✅ **Social Features**: Posts, comments, likes, and community engagement
- ✅ **Image Management**: Cloudinary integration for image uploads
- ✅ **Activity Logging**: Track user actions and admin activities
- ✅ **Email Notifications**: Nodemailer integration for email communications

### Dashboard Features
- Student Dashboard: View joined clubs, upcoming events, messages
- Club Manager Dashboard: Manage club members, create events, post updates
- Admin Dashboard: User management, moderation, activity logs

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js, Google OAuth
- **Real-time**: Socket.io
- **Image Storage**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Deployment**: Docker, Docker Compose

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Routing**: React Router v6
- **UI Components**: Headless UI, Lucide React
- **Notifications**: React Hot Toast

## Architecture

```
CampusConnect/
├── server/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── sockets/          # Socket.io configuration
│   │   ├── utils/            # Utility functions
│   │   └── index.js          # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React Context
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── styles/           # Global styles
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Docker & Docker Compose (for containerized deployment)
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   cd CampusConnect
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```

## Environment Setup

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/campusconnect

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd client
npm run dev
```

Access the application at `http://localhost:3000`

### Production Build

**Backend**
```bash
cd server
npm run build
npm start
```

**Frontend**
```bash
cd client
npm run build
npm run preview
```

## Docker Deployment

### Using Docker Compose

1. **Setup environment variables**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

2. **Build and run containers**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. **Stop containers**
   ```bash
   docker-compose down
   ```

### Individual Docker Builds

**Backend**
```bash
docker build -f server/Dockerfile -t campusconnect-backend .
docker run -p 5000:5000 campusconnect-backend
```

**Frontend**
```bash
docker build -f client/Dockerfile -t campusconnect-frontend .
docker run -p 3000:3000 campusconnect-frontend
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Club Endpoints

#### Get All Clubs
```
GET /api/clubs
GET /api/clubs?category=sports&search=football
```

#### Create Club
```
POST /api/clubs
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Football Club",
  "description": "Club for football enthusiasts",
  "category": "sports",
  "location": "Field A"
}
```

#### Join Club
```
POST /api/clubs/{clubId}/join
Authorization: Bearer <token>
```

### Event Endpoints

#### Get Events
```
GET /api/events
GET /api/events?club={clubId}&status=upcoming
```

#### Create Event
```
POST /api/events/club/{clubId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Football Match",
  "description": "Inter-club friendly",
  "startDate": "2024-06-15T10:00:00Z",
  "endDate": "2024-06-15T12:00:00Z",
  "location": "Main Stadium"
}
```

#### Register for Event
```
POST /api/events/{eventId}/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "going"
}
```

### Post Endpoints

#### Create Post
```
POST /api/posts/club/{clubId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great event yesterday!",
  "visibility": "members_only"
}
```

#### Like Post
```
POST /api/posts/{postId}/like
Authorization: Bearer <token>
```

### Message Endpoints

#### Send Message
```
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiver": "{userId}",
  "content": "Hello!",
  "messageType": "direct"
}
```

#### Get Direct Messages
```
GET /api/messages/direct/{otherId}
Authorization: Bearer <token>
```

## User Roles

### Student
- Create account
- Join clubs and events
- View posts and updates
- Send direct and group messages
- Register for events
- Create posts in joined clubs

### Club Manager
- All student features
- Create and manage clubs
- Create events
- Manage club members and roles
- Post club updates
- View club analytics

### Admin
- All features
- Manage all users
- Moderate reports and content
- View activity logs
- System configuration

## Socket Events

### Real-time Notifications
- `user-online`: User comes online
- `user-offline`: User goes offline
- `user-typing`: User is typing
- `user-stop-typing`: User stopped typing

### Messaging
- `send-message`: Send direct message
- `receive-message`: Receive message
- `join-club-chat`: Join club channel
- `club-message`: Send to club
- `receive-club-message`: Receive club message

### Notifications
- `send-notification`: Send notification
- `receive-notification`: Receive notification

## Database Models

- **User**: Student, Manager, Admin accounts
- **Club**: Student clubs and organizations
- **Event**: Campus events and activities
- **Post**: Club updates and announcements
- **Message**: Direct and group messages
- **Notification**: Real-time notifications
- **Report**: Content moderation reports
- **ActivityLog**: User activity tracking

## Security Features

- JWT Authentication with refresh tokens
- Google OAuth 2.0 integration
- CORS protection
- Rate limiting on auth endpoints
- Helmet.js security headers
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Performance Optimizations

- Request compression
- Image optimization with Cloudinary
- Database query optimization with indexes
- Pagination for large datasets
- Caching strategies
- CDN-ready architecture

## Error Handling

- Centralized error handler middleware
- Consistent API error responses
- Client-side error boundaries
- Validation error messages
- Request logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or feedback:
- Open an issue on GitHub
- Contact: support@campusconnect.com

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Video chat integration
- [ ] Advanced analytics
- [ ] Club memberships and payments
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Event ticketing system

---

**CampusConnect** - Connecting Your Campus Community 🎓
