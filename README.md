# ClassifiedHub - Modern Classified Ads Platform

A modern, user-friendly classified ads website built with the MERN stack (MongoDB, Express.js, React, Node.js). This project addresses the usability issues found in traditional classified ad websites by providing a clean, responsive interface with modern features.

## Features

### 🎨 Modern UI/UX
- Clean, card-based layouts
- Responsive design for mobile and desktop
- Intuitive navigation and search
- Modern color scheme and typography

### 🔍 Advanced Search & Filtering
- Text search across titles and descriptions
- Category-based filtering
- Location-based search
- Price range filtering
- Multiple sorting options

### 👤 User Management
- User registration and authentication
- Profile management
- Personal dashboard for managing ads

### 📝 Ad Management
- Easy ad posting with image upload
- Ad editing and deletion
- View tracking and analytics
- Contact information management

### 🔒 Security
- JWT-based authentication
- Input validation and sanitization
- Protected routes and middleware

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icons
- **React Hot Toast** - Notifications

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## Installation & Setup

### 1. Clone the Repository
```bash
cd c:\Users\LOQ\Desktop\classfied
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment variables (update the `.env` file):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classifiedads
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system, then seed the categories:
```bash
cd backend
node seeds/categories.js
```

## Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

### Start the Frontend Development Server
Open a new terminal:
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

## Usage

1. **Browse Ads**: Visit the homepage to see featured ads and browse by categories
2. **Search**: Use the search bar to find specific items
3. **Register/Login**: Create an account to post ads and manage your listings
4. **Post an Ad**: Click "Post Ad" to create a new listing
5. **Manage Ads**: View and manage your ads from the "My Ads" page
6. **Profile**: Update your profile information

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Ads
- `GET /api/ads` - Get all ads (with filtering)
- `GET /api/ads/:id` - Get single ad
- `POST /api/ads` - Create new ad (protected)
- `PUT /api/ads/:id` - Update ad (protected)
- `DELETE /api/ads/:id` - Delete ad (protected)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/users/my-ads` - Get user's ads (protected)

## Project Structure

```
classfied/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Ad.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/
│   │   ├── ads.js
│   │   ├── auth.js
│   │   ├── categories.js
│   │   └── users.js
│   ├── seeds/
│   │   └── categories.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout/
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── AdsList.js
│   │   │   ├── AdDetail.js
│   │   │   ├── PostAd.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── MyAds.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check the connection string in `.env`
   - Ensure the database name is correct

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill the process using the port: `netstat -ano | findstr :5000`

3. **CORS Issues**
   - Make sure the backend is running on port 5000
   - Check the proxy setting in frontend `package.json`

4. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.
