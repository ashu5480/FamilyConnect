# FAMILYConnect

**Plan. Share. Coordinate. Celebrate.**

Your family's digital home for life's biggest moments.

## Overview

FAMILYConnect is a private family event management and collaboration mobile application. Families can use it for weddings, engagements, birthdays, anniversaries, pooja, housewarming, baby showers, family reunions, and other celebrations.

The app combines:
- Family members & events
- Event schedules & tasks
- Family chat & guest management
- RSVP & photos/videos
- Documents & notifications
- Expenses & digital invitations
- AI assistant & AI image processing
- Transparent-background images
- Event memories

## Tech Stack

**Mobile:**
- React Native + Expo
- TypeScript
- Expo Router

**Backend:**
- Next.js 14 (App Router)
- TypeScript
- REST APIs
- Deploy on Vercel

**Database:**
- MongoDB Atlas
- Mongoose

**Media Storage:**
- Vercel Blob (preferred) or Cloudinary

**AI:**
- Provider abstraction (Remove.bg, Replicate, OpenAI)

## Project Structure

```
FamilyConnect/
├── mobile/                    # React Native + Expo app
│   ├── app/                   # Expo Router screens
│   │   ├── (auth)/            # Auth screens
│   │   ├── (tabs)/            # Tab screens
│   │   ├── event/             # Event detail screens
│   │   └── _layout.tsx        # Root layout
│   ├── components/            # Reusable UI components
│   │   └── animations/        # Motion system
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API clients
│   ├── constants/             # Theme & constants
│   └── package.json
├── backend/                   # Next.js API
│   ├── src/
│   │   ├── app/api/           # API routes
│   │   ├── lib/               # DB, auth, utils
│   │   ├── middleware/        # Auth
│   │   ├── models/            # Mongoose schemas
│   │   └── services/          # Business logic
│   └── package.json
├── ARCHITECTURE.md
├── PROGRESS.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go (for mobile development)
- MongoDB Atlas account

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npm start
# Scan QR code with Expo Go
```

### Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/familyconnect
MONGODB_DB_NAME=familyconnect
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
AI_API_KEY=your-ai-api-key
BLOB_STORAGE_TOKEN=your-vercel-blob-token
REMOVEBG_API_KEY=your-removebg-api-key
```

**Mobile (.env):**
```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Features

### P0 (MVP)
- Authentication (register, login, logout, forgot password)
- Family creation/join
- Family members
- Event creation
- Event dashboard
- Schedule
- Tasks
- Chat
- Guests & RSVP
- Photos
- Notifications
- Mobile UI
- Security
- Background removal

### P1
- Documents
- Expenses
- Digital invitations
- Search
- AI assistant
- Transparent image gallery
- Basic invitation designer

### P2
- AI photo organization
- AI-generated memories
- Automatic reels
- Advanced invitation templates
- Payments/subscriptions

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Security

- JWT authentication with refresh tokens
- Role-based access control (ADMIN, ORGANIZER, MEMBER, GUEST)
- Backend-enforced permissions
- No secrets in mobile app
- Secure media URLs
- Input validation with Zod
- Rate limiting

## Deployment

**Backend:** Deploy to Vercel
```bash
cd backend
vercel --prod
```

**Mobile:** Build with EAS
```bash
cd mobile
eas build --platform android
eas build --platform ios
```

## License

Private - All rights reserved.