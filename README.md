# ContentHub - Centralized Content Planning and Multi-Platform Management System

## Overview

ContentHub is a MERN (MongoDB, Express, React, Node.js) stack web application that helps content creators manage their presence across multiple platforms (YouTube, TikTok, Instagram, Twitch, Patreon, Twitter, LinkedIn) from a single unified dashboard.

ContentHub is a full-stack content management and analytics dashboard that helps creators manage posts, schedule content, and track platform-wise performance including views, likes, comments, shares, revenue, and engagement.

## Project Information

**Student:** K. Varaprasad (A24126510030)  
**Course:** 23CS4219 - Software Engineering Laboratory  
**College:** ANITS Visakhapatnam  
**Guide:** Prof. A. Rohini

## Features

- ✅ **Unified Dashboard** - View all analytics in one place
- ✅ **Content Calendar** - Visual calendar for scheduled posts
- ✅ **Multi-Platform Analytics** - Track performance across platforms
- ✅ **Post Scheduling** - Schedule posts for future publishing
- ✅ **User Profiles** - Manage user information and connected platforms
- ✅ **Real-time Data** - MongoDB integration for instant updates

## Tech Stack

### Frontend
- React.js 18.2.0
- React Router v6
- Axios for API calls
- TailwindCSS for styling
- Chart.js for analytics

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- CORS enabled

### Tools
- VS Code
- Postman
- Git

## Project Structure

```
ContentHub/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Post.js            # Post schema
│   │   ├── Schedule.js        # Schedule schema
│   │   └── Analytics.js       # Analytics schema
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── posts.js           # Post endpoints
│   │   ├── schedules.js       # Schedule endpoints
│   │   └── analytics.js       # Analytics endpoints
│   ├── .env.example           # Environment variable template
│   ├── package.json           # Dependencies
│   └── server.js              # Main server file
│
└── frontend/
    ├── public/
    │   └── index.html         # HTML template
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx       # Landing page
    │   │   ├── Register.jsx   # Registration page
    │   │   ├── Login.jsx      # Login page
    │   │   ├── MainDashboard.jsx  # Main dashboard
    │   │   └── Profile.jsx    # User profile
    │   ├── components/
    │   │   ├── Navbar.jsx     # Navigation bar
    │   │   ├── Sidebar.jsx    # Sidebar navigation
    │   │   ├── Dashboard.jsx  # Dashboard component
    │   │   ├── ContentCalendar.jsx
    │   │   ├── Analytics.jsx  # Analytics component
    │   │   └── ScheduleManager.jsx
    │   ├── App.js             # Main App component
    │   ├── App.css            # Global styles
    │   └── index.js           # React entry point
    ├── .env.example           # Environment variable template
    └── package.json           # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend folder:
```bash
cd ContentHub/backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and set your local MongoDB connection string and a strong JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ContentHub
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Keep `.env` private; environment files are excluded from Git. Use your own MongoDB Atlas URI if needed.

4. Start the server:
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd ContentHub/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

App runs on: `http://localhost:3000`

### Password Reset

Submit a registered email address at `/forgot-password`. The API emails a one-time reset link, which expires after 20 minutes. The response message is the same whether or not the account exists, and the reset token is never returned by the API or displayed on the website.

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM` in the private backend `.env` file. For Gmail, use an App Password with 2-Step Verification enabled; do not use your normal Gmail password. Keep these settings private and never commit `.env`.

## Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  username: String (unique),
  profilePicture: String,
  platforms: [String],
  bio: String,
  timestamps: Date
}
```

### Post Model
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  content: String,
  mediaUrl: String,
  platforms: [String],
  status: enum ['draft', 'scheduled', 'published', 'archived'],
  scheduledTime: Date,
  category: String,
  tags: [String],
  views: Number,
  likes: Number,
  timestamps: Date
}
```

### Schedule Model
```javascript
{
  userId: ObjectId (ref: User),
  postId: ObjectId (ref: Post),
  platform: String,
  scheduledTime: Date,
  status: enum ['pending', 'published', 'failed', 'cancelled'],
  notes: String,
  timestamps: Date
}
```

### Analytics Model
```javascript
{
  userId: ObjectId (ref: User),
  postId: ObjectId (ref: Post),
  platform: String,
  views: Number,
  likes: Number,
  comments: Number,
  shares: Number,
  watches: Number,
  revenue: Number,
  engagement: Number,
  date: Date,
  timestamps: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts` - Get all posts (protected)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/publish` - Publish post

### Schedules
- `POST /api/schedules` - Create schedule
- `GET /api/schedules` - Get all schedules (protected)
- `GET /api/schedules/platform/:platform` - Get by platform
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Analytics
- `POST /api/analytics` - Create analytics
- `GET /api/analytics` - Get all analytics (protected)
- `GET /api/analytics/platform/:platform` - Get by platform
- `GET /api/analytics/summary/all` - Get summary

## Usage Instructions

### 1. Register/Login
- Go to `http://localhost:3000`
- Click "Get Started" or "Register"
- Fill in your details
- Login with your credentials

### 2. Connect Platforms
- Go to Profile
- Select which platforms you use
- Save changes

### 3. Create Posts
- Go to Dashboard
- Create new posts with content
- Select target platforms
- Save as draft or schedule

### 4. Schedule Posts
- Go to Schedules
- Create schedule for existing posts
- Select platform and date/time
- Post will be published at scheduled time

### 5. View Analytics
- Go to Analytics
- Select platform or view all
- See performance metrics
- Track revenue and engagement

### 6. Content Calendar
- Go to Content Calendar
- View all scheduled posts
- See upcoming publications
- Manage scheduling

## Running Both Simultaneously

```bash
# Terminal 1 - Backend
cd ContentHub/backend
npm run dev

# Terminal 2 - Frontend
cd ContentHub/frontend
npm start
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ContentHub
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Testing

### Test Account (for development)
Create an account through the registration page for local testing.

## Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB Atlas connection string
- Check firewall settings
- Ensure IP whitelist includes your IP

### CORS Error
- Backend must have CORS enabled
- Frontend API URL must match backend

### Port Already in Use
```bash
# Change PORT in backend .env to 5001
# Or kill process using port 5000
```

## Features Implemented

✅ User Authentication with JWT  
✅ Multi-platform post management  
✅ Content scheduling system  
✅ Analytics dashboard  
✅ Content calendar  
✅ User profile management  
✅ Responsive design  
✅ Real-time data updates  

## Future Enhancements

- [ ] Browser extension for direct scraping
- [ ] AI-powered content suggestions
- [ ] Advanced analytics with ML predictions
- [ ] Mobile app version
- [ ] Real-time notifications
- [ ] Social media integration SDKs
- [ ] Team collaboration features

## Limitations

1. Requires manual data entry (no real API integration with platforms)
2. Analytics are stored in database, not real-time from platforms
3. No automated publishing (scheduled posts require manual action)

## References

- Pressman, R. S. (2014). Software Engineering: A Practitioner's Approach (8th ed.). McGraw-Hill Education.
- Sommerville, I. (2015). Software Engineering (10th ed.). Pearson Education.

## Author

**A. Sai Mounika**  
III Year B.Tech CSE  
ANITS Visakhapatnam  
Roll Number: A21126510003

## License

This project is created for educational purposes as part of the Software Engineering Laboratory course.

## Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Check MongoDB Atlas settings
4. Verify API endpoints

---

**Last Updated:** September 2026  
**Status:** Completed and Ready for Deployment
