# CampusConnect - Quick Start Guide 🚀

## 5-Minute Setup

### Option 1: Local Development

#### Prerequisites
- Node.js 18+ installed
- MongoDB running locally
- npm or yarn

#### Steps

```bash
# 1. Navigate to project
cd CampusConnect

# 2. Setup Backend
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# 3. In a new terminal, Setup Frontend
cd client
npm install
cp .env.example .env
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 2: Docker Deployment (Easiest)

```bash
# 1. Setup environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit .env files with your configuration

# 2. Start with Docker Compose
docker-compose up --build

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## Essential Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable OAuth 2.0
4. Add credentials (OAuth Client ID)
5. Add to `.env`:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com)
2. Get your API credentials
3. Add to `.env`:
```env
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Email Setup (Gmail)
1. Enable 2FA on Gmail
2. Generate App Password
3. Add to `.env`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Project Structure at a Glance

```
CampusConnect/
├── server/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API endpoints
│   │   ├── controllers/ # Business logic
│   │   ├── services/    # Reusable logic
│   │   └── middleware/  # Auth, validation, etc.
│   ├── Dockerfile
│   └── package.json
│
├── client/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   └── services/    # API client
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── package.json
│
├── docker-compose.yml   # Orchestration
├── README.md            # Documentation
└── DEVELOPMENT.md       # Developer guide
```

## First Steps After Setup

1. **Create an Account**
   - Visit http://localhost:3000
   - Click "Register"
   - Fill in the form

2. **Create a Club** (if you set role to 'club_manager')
   - Go to Dashboard
   - Create a new club

3. **Create an Event**
   - Go to your club
   - Create an event

4. **Test Real-time Features**
   - Open in two browser windows
   - Send messages between accounts
   - See real-time notifications

## Useful Commands

### Backend
```bash
cd server

# Development
npm run dev

# Production
npm start

# View logs
npm run logs

# Format code
npm run format
```

### Frontend
```bash
cd client

# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

### Docker
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build --no-cache
```

## Default Credentials

Create test accounts with these credentials:

**Student Account**
- Email: student@example.com
- Password: TestPass123!

**Manager Account**
- Email: manager@example.com
- Password: TestPass123!

**Admin Account** (Set role to 'admin' in database)
- Email: admin@example.com
- Password: TestPass123!

## Testing the Application

### Test Scenarios

1. **Authentication**
   - [ ] Register new account
   - [ ] Login with credentials
   - [ ] Logout
   - [ ] Update profile

2. **Clubs**
   - [ ] View all clubs
   - [ ] Join a club
   - [ ] Leave a club
   - [ ] View club details

3. **Events**
   - [ ] View events
   - [ ] Register for event
   - [ ] Cancel registration
   - [ ] View event details

4. **Posts**
   - [ ] Create post
   - [ ] Like post
   - [ ] Comment on post
   - [ ] Delete post

5. **Messages**
   - [ ] Send direct message
   - [ ] Send group message
   - [ ] Receive real-time messages
   - [ ] Mark as read

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -ti:5000 | xargs kill -9

# Check MongoDB connection
mongosh mongodb://localhost:27017/campusconnect

# Check .env file exists
ls -la server/.env
```

### Frontend won't load
```bash
# Clear cache and node_modules
cd client
rm -rf node_modules package-lock.json
npm install

# Clear browser cache
# Chrome: Ctrl+Shift+Delete
```

### Docker issues
```bash
# Remove all containers
docker-compose down -v

# Rebuild everything
docker-compose build --no-cache

# Start fresh
docker-compose up
```

### MongoDB connection error
```bash
# Start MongoDB
mongod

# Or using Docker
docker run -d -p 27017:27017 --name campusconnect-mongo mongo:6-alpine
```

## Next Steps

1. **Read the full documentation**
   - Check [README.md](./README.md)
   - Check [DEVELOPMENT.md](./DEVELOPMENT.md)

2. **Explore the code**
   - Backend: `server/src/`
   - Frontend: `client/src/`

3. **Deploy**
   - Deploy backend to Heroku/Railway/DigitalOcean
   - Deploy frontend to Vercel/Netlify

4. **Customize**
   - Change colors in `tailwind.config.js`
   - Add your logo
   - Customize user roles

## Support & Resources

- **Backend**: Express.js, MongoDB, Socket.io
- **Frontend**: React, Vite, Tailwind CSS
- **Deployment**: Docker, Docker Compose

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process on port or use different port |
| MongoDB not running | Start MongoDB service or use Docker |
| CORS errors | Check CLIENT_URL in .env |
| Socket.io not connecting | Check VITE_SOCKET_URL in .env |
| Cloudinary upload fails | Check API credentials |
| Email not sending | Check Gmail app password |

## Quick Reference

```bash
# Clone and setup
git clone <repo>
cd CampusConnect

# Development
docker-compose up

# Production build
docker-compose -f docker-compose.prod.yml up -d

# Cleanup
docker-compose down -v
```

---

**You're all set!** 🎉 Happy coding!

For detailed information, check [README.md](./README.md) and [DEVELOPMENT.md](./DEVELOPMENT.md)
