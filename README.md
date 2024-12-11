# YouTube Clone - MERN Stack Application

## 🎥 Project Overview
A full-stack YouTube clone built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This application allows users to watch videos, create channels, upload content, and interact with other users through comments and likes/dislikes.

## ⚡ Features

### User Features
- User authentication (Register/Login) with JWT
- Create and manage channels
- Upload, edit, and delete videos
- Comment on videos
- Like/Dislike videos
- Search videos
- Filter videos by category

### Video Features
- Video playback
- Video recommendations
- View count tracking
- Responsive video player
- Video descriptions and metadata

### Channel Features
- Channel creation and customization
- Channel video management
- Channel statistics

## 🛠️ Technical Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Responsive design using CSS/SCSS

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- RESTful API architecture

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos` - Upload new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Channels
- `GET /api/channels` - Get all channels
- `GET /api/channels/:id` - Get specific channel
- `POST /api/channels` - Create new channel
- `PUT /api/channels/:id` - Update channel

### Comments
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comments` - Add comment
- `PUT /api/comments/:id` - Edit comment
- `DELETE /api/comments/:id` - Delete comment

## 🚀 Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/youtube-clone.git
```

2. Install dependencies for backend
```bash
cd backend
npm install
```

3. Install dependencies for frontend
```bash
cd frontend
npm install
```

4. Create a .env file in the backend directory with:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the frontend development server
```bash
cd frontend
npm start
```

## 📱 Responsive Design
- Fully responsive layout
- Mobile-first approach
- Supports all modern browsers

## 🔒 Security Features
- JWT based authentication
- Encrypted password storage
- Protected API endpoints

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
