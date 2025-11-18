# DateWise 💚

**Activity-first dating app that skips the endless messaging phase**

## 🌟 Key Differentiator

DateWise eliminates the awkward "what should we do?" conversation. Users commit to 1-2 specific activities they're willing to do BEFORE matching. When there's a mutual match, they already have a concrete plan to meet up.

## Core Concept

- Users create detailed profiles AND select activities they're open to doing
- Receive 2-3 curated matches daily
- AI explains WHY they should meet (compatibility) and WHAT they could do together (shared activities)
- Minimal messaging - just enough to coordinate logistics
- Focus on real-world meetups, not endless chatting

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **AI**: Anthropic Claude API
- **Authentication**: JWT + bcrypt

## Project Structure

```
datewise/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── routes/   # API routes
│   │   ├── controllers/
│   │   ├── models/   # Database models
│   │   ├── middleware/
│   │   ├── services/ # Business logic (AI, matching)
│   │   └── types/    # TypeScript types
│   └── migrations/   # Database migrations
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/ # API calls
│   │   ├── types/
│   │   └── utils/
│   └── public/
└── shared/          # Shared types between frontend/backend
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd datewise
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. Set up the database:
```bash
# Create PostgreSQL database
createdb datewise

# Run migrations
cd backend
npm run migrate
```

5. Seed activities database:
```bash
npm run seed
```

6. Start development servers:
```bash
# From root directory
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend on http://localhost:5173

## Features

### Phase 1 (MVP)
- ✅ User registration & authentication
- ✅ Profile creation with activity selection
- ✅ Pre-populated activity database (Singapore/Indonesia)
- ✅ Claude API integration for match recommendations
- ✅ Interest system (like/pass)
- ✅ Mutual match detection
- ✅ Basic messaging for coordination

### Phase 2 (Planned)
- Automated matching algorithm
- Date planning & scheduling
- Contact info exchange
- Photo uploads
- Date feedback system

### Phase 3 (Future)
- Push notifications
- Admin analytics dashboard
- Premium features
- Verified profiles
- Success stories

## Database Schema

Key tables:
- `users` - User profiles and preferences
- `activities` - Pre-populated activity catalog
- `user_activities` - User's selected activities with custom details
- `matches` - Daily match assignments with AI insights
- `interests` - Like/pass actions
- `date_plans` - Scheduled meetups
- `messages` - Limited messaging for coordination

## API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/activities` - Add activity preferences

### Matches
- `GET /api/matches/daily` - Get today's matches (2-3)
- `POST /api/matches/:id/interest` - Express interest
- `GET /api/matches/mutual` - Get mutual matches

### Messaging
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages/:matchId` - Send message (500 char limit)

## Success Metrics

- Mutual match rate
- Date plans created (not just matches)
- Date confirmation rate
- Date completion rate
- Positive feedback percentage
- Time from match to date planned
- Most popular activities

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved
