# StudentClubs Development Guide

## Getting Started with Development

### Quick Start

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in another terminal)
cd client
npm install
npm run dev
```

## Project Structure Details

### Backend Structure

```
server/src/
├── config/
│   ├── database.js       # MongoDB connection
│   ├── cloudinary.js     # Cloudinary configuration
│   └── email.js          # Email service setup
├── models/
│   ├── User.js           # User schema
│   ├── Club.js           # Club schema
│   ├── Event.js          # Event schema
│   ├── Post.js           # Post schema
│   ├── Message.js        # Message schema
│   ├── Notification.js   # Notification schema
│   ├── Report.js         # Report schema
│   └── ActivityLog.js    # Activity log schema
├── controllers/
│   ├── authController.js
│   ├── clubController.js
│   ├── eventController.js
│   ├── postController.js
│   └── messageController.js
├── services/
│   ├── userService.js
│   ├── clubService.js
│   ├── eventService.js
│   ├── postService.js
│   └── messageService.js
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── errorHandler.js
│   └── securityMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── clubRoutes.js
│   ├── eventRoutes.js
│   ├── postRoutes.js
│   └── messageRoutes.js
├── sockets/
│   └── socketConfig.js
├── utils/
│   ├── tokenUtils.js
│   ├── uploadUtils.js
│   ├── validators.js
│   ├── queryHelpers.js
│   └── activityLogger.js
└── index.js              # Entry point
```

### Frontend Structure

```
client/src/
├── components/
│   ├── UI.jsx            # Reusable UI components
│   ├── Navbar.jsx        # Navigation bar
│   └── PrivateRoute.jsx  # Route protection
├── context/
│   ├── AuthContext.jsx   # Authentication state
│   └── SocketContext.jsx # Socket.io state
├── hooks/
│   └── useApi.js         # Custom API hooks
├── pages/
│   ├── AuthPages.jsx     # Login/Register pages
│   ├── HomePage.jsx      # Home page
│   ├── ClubsEventsPages.jsx  # Clubs/Events listing
│   └── DashboardPage.jsx # Dashboard
├── services/
│   └── api.js            # API client
├── styles/
│   └── index.css         # Global styles
├── utils/                # Utility functions
├── App.jsx               # Root component
└── main.jsx              # Entry point
```

## Common Tasks

### Adding a New API Endpoint

1. **Create Model** (if needed) in `server/src/models/`
2. **Create Service** in `server/src/services/`
3. **Create Controller** in `server/src/controllers/`
4. **Create Routes** in `server/src/routes/`

Example:
```javascript
// service
export const exampleService = {
  async getExample(id) {
    return await Example.findById(id);
  }
};

// controller
export const getExampleController = asyncHandler(async (req, res) => {
  const example = await exampleService.getExample(req.params.id);
  res.json({ success: true, data: example });
});

// route
router.get('/:id', authMiddleware, getExampleController);
```

### Adding a New Page

1. Create component in `client/src/pages/`
2. Add route in `client/src/App.jsx`

```javascript
<Route path="/example" element={<ExamplePage />} />
```

### Using the API

```javascript
import { exampleService } from '../services/api';

// In a component
const { useEffect, useState } = require('react');

export const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    exampleService.getExample().then(response => {
      if (response.success) {
        setData(response.data);
      }
    });
  }, []);

  return <div>{/* Render data */}</div>;
};
```

### Real-time Features with Socket.io

```javascript
import { useSocket } from '../context/SocketContext';

export const ChatComponent = () => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', (message) => {
        console.log('New message:', message);
      });
    }
  }, [socket]);

  const sendMessage = (content) => {
    socket?.emit('send-message', {
      content,
      receiverId: 'userId'
    });
  };

  return <div>{/* Chat UI */}</div>;
};
```

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## Deployment

### Deploy to Production

1. **Backend (Node.js)**
   - Set environment variables
   - Deploy to AWS EC2, DigitalOcean, Heroku, or similar
   - Ensure MongoDB connection

2. **Frontend (React)**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, AWS S3, or similar
   - Set API URL environment variable

3. **Using Docker**
   - Build images: `docker-compose build`
   - Push to registry: `docker push <image>`
   - Deploy to Docker hosting (AWS ECS, DigitalOcean, etc.)

## Debugging

### Backend Debugging

```javascript
// Add logging
console.log('Debug message:', variable);

// Use debug package
import debug from 'debug';
const log = debug('app:service');
log('Message:', data);
```

### Frontend Debugging

```javascript
// React DevTools
// Redux DevTools
// Network tab in Chrome DevTools

// Console logging
console.log('State:', state);
console.table(data);
```

## Performance Tips

1. **Database Indexing**: Add indexes to frequently queried fields
2. **Pagination**: Always paginate large result sets
3. **Caching**: Use Redis for session caching
4. **Code Splitting**: Lazy load React components
5. **Image Optimization**: Use Cloudinary for images
6. **API Rate Limiting**: Implement rate limiting

## Security Best Practices

1. Never commit `.env` files
2. Use HTTPS in production
3. Validate all inputs
4. Use secure password hashing
5. Keep dependencies updated
6. Use security headers (Helmet)
7. Implement CORS properly
8. Regular security audits

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/campusconnect
```

### Port Already in Use
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Check CLIENT_URL in backend .env
- Verify Socket.io CORS configuration
- Check browser console for specific errors

## Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Socket.io Documentation](https://socket.io/)
- [Docker Documentation](https://docs.docker.com/)

## Contributing Guidelines

1. Create a branch for each feature
2. Follow naming conventions
3. Write meaningful commit messages
4. Test before submitting PR
5. Update documentation

---

Happy coding! 🚀
