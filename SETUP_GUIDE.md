# DateWise - Complete Setup Guide

Welcome to DateWise! This guide will help you set up and run the application locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd DateWise
```

### 2. Set Up the Database

Create a PostgreSQL database:

```bash
createdb datewise
```

Or using psql:

```sql
CREATE DATABASE datewise;
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/datewise

# JWT & Sessions (change these!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Server
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173
```

**Important Security Notes:**
- **Never commit your `.env` file** (it's already in `.gitignore`)
- Generate strong random secrets for production:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Get your Anthropic API key from: https://console.anthropic.com/

### 4. Install Dependencies

Install all project dependencies:

```bash
npm install
```

This will install dependencies for both the backend and frontend.

### 5. Set Up the Database Schema

Run the migration to create all tables:

```bash
cd backend
psql -d datewise -f migrations/001_initial_schema.sql
```

Or if you prefer:

```bash
psql datewise < backend/migrations/001_initial_schema.sql
```

### 6. Seed the Activities Database

Populate the database with activities:

```bash
cd backend
npm run seed
```

You should see output like:

```
✅ Successfully seeded 70+ activities
📊 Activities by category:
   coffee_casual: 6
   outdoor_active: 9
   food_dining: 10
   ...
```

### 7. Start the Development Servers

From the root directory:

```bash
npm run dev
```

This will start both servers:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5173

## 🎯 Using the Application

### First Time Setup

1. **Register an Account**
   - Navigate to http://localhost:5173
   - Click "Get Started Free"
   - Fill in your basic information
   - Must be 18+ years old

2. **Complete Onboarding** (The Key Differentiator!)
   - **Step 1**: Fill in your profile details (interests, values, lifestyle, relationship goals)
   - **Step 2**: Select activities you want to do on dates (this is the magic!)
   - **Step 3**: Customize your activity preferences (add venues, times, notes)

3. **Get Matched**
   - Receive 2-3 curated matches daily
   - Each match includes:
     - AI-generated compatibility reasons
     - Specific date ideas based on shared activities
     - Shared activity details

4. **Express Interest**
   - Like profiles that interest you
   - When they like you back → Mutual Match! 🎉

5. **Plan Your Date**
   - Access minimal messaging
   - Coordinate logistics
   - Share contact info
   - Set date details
   - Meet in real life!

## 📁 Project Structure

```
datewise/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI, matching)
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Entry point
│   ├── migrations/         # Database migrations
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   ├── store/          # State management (Zustand)
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── .env.example            # Example environment variables
├── package.json            # Root package.json
└── README.md
```

## 🔑 Key Features Implemented

### Backend
- ✅ User authentication with JWT
- ✅ Profile management with activity preferences
- ✅ Claude AI integration for match recommendations
- ✅ Matching algorithm (manual assignment for MVP)
- ✅ Interest system (like/pass)
- ✅ Mutual match detection
- ✅ Minimal messaging (500 char limit, 7-day expiry)
- ✅ Date planning and contact exchange
- ✅ Comprehensive API with validation

### Frontend
- ✅ Beautiful gradient design (pink to purple)
- ✅ Responsive mobile-first UI
- ✅ Landing page
- ✅ Authentication (login/register)
- ✅ Onboarding with activity selection (KEY DIFFERENTIATOR)
- ✅ Dashboard with stats
- ✅ Daily matches with AI insights
- ✅ Mutual matches page
- ✅ Chat for date coordination
- ✅ Profile management

### AI Features
- ✅ Compatibility analysis
- ✅ Personalized date suggestions
- ✅ Based on shared activities and profiles
- ✅ Uses Claude 3.5 Sonnet

## 🔧 Development Commands

### Root Commands

```bash
# Install all dependencies
npm install

# Run both servers
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Commands

```bash
cd backend

# Development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Seed activities
npm run seed

# Run database migration
psql datewise < migrations/001_initial_schema.sql
```

### Frontend Commands

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing the Application

### Create Test Users

1. Register 2-3 test accounts with different profiles
2. Select overlapping activities for each
3. Use admin endpoint to create matches (see API docs below)

### Admin Endpoints

**Create Manual Match** (for testing):

```bash
curl -X POST http://localhost:3001/api/matches/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userAId": 1,
    "userBId": 2
  }'
```

**Find Potential Matches**:

```bash
curl http://localhost:3001/api/matches/potential/1?limit=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📡 API Documentation

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get profile with activities
- `PUT /api/profile` - Update profile
- `POST /api/profile/activities` - Add activity preference
- `PUT /api/profile/activities/:id` - Update activity details
- `DELETE /api/profile/activities/:id` - Remove activity

### Activities
- `GET /api/activities` - List all activities
- `GET /api/activities/by-category` - Grouped by category
- `GET /api/activities/popular` - Most popular activities

### Matches
- `GET /api/matches/dashboard` - Dashboard data
- `GET /api/matches/daily` - Today's matches
- `GET /api/matches/mutual` - Mutual matches
- `POST /api/matches/:matchId/interest` - Like/pass

### Messages
- `GET /api/messages/:matchId` - Get messages
- `POST /api/messages/:matchId` - Send message
- `GET /api/messages/unread` - Unread count

### Date Plans
- `GET /api/date-plans/:matchId` - Get date plan
- `PUT /api/date-plans/:matchId` - Update date plan
- `POST /api/date-plans/:matchId/feedback` - Submit feedback

## 🐛 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL service from Services
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution**: Kill the process or change the port in `.env`
```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Anthropic API Error
```
Error: API key required
```
**Solution**: Ensure you've set `ANTHROPIC_API_KEY` in `.env` and restarted the server.

### Migration Errors
If you get errors running migrations:

1. Drop and recreate the database:
   ```bash
   dropdb datewise
   createdb datewise
   ```

2. Run migration again:
   ```bash
   psql datewise < backend/migrations/001_initial_schema.sql
   ```

## 🚀 Deployment

### Environment Setup

For production, ensure you have:
- PostgreSQL database (consider managed services like Neon, Supabase, or AWS RDS)
- Node.js 18+ environment
- Environment variables configured

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Set production environment variables
3. Run migrations on production database
4. Seed activities
5. Start server: `npm start`

### Frontend Deployment

1. Update `VITE_API_URL` if needed
2. Build:
   ```bash
   cd frontend
   npm run build
   ```
3. Deploy `dist/` folder to your hosting (Vercel, Netlify, etc.)

### Recommended Hosting
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: Neon, Supabase, AWS RDS

## 📚 Additional Resources

- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the error logs
3. Ensure all prerequisites are installed
4. Verify environment variables are correct

## 🎉 Success!

If everything is working, you should be able to:
1. Visit http://localhost:5173
2. Create an account
3. Complete onboarding with activity selection
4. See the dashboard
5. Create test matches and explore the app

Enjoy building with DateWise! 💚
