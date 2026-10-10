# FAMILYConnect — Architecture

## 1. System Architecture

```
MOBILE APP (React Native + Expo)
         |
         | HTTPS / REST
         v
NEXT.JS API (Vercel)
         |
  +------+------+
  |      |      |
  v      v      v
MongoDB  Media   AI APIs
Atlas    Storage
```

### Rules
- Mobile NEVER connects directly to MongoDB.
- All DB access through backend.
- Never expose: MongoDB URI, JWT secret, AI API keys, storage private keys in mobile app.

## 2. Mobile Architecture

- React Native + Expo
- Expo Router (file-based routing)
- TypeScript
- Reusable component architecture

Structure:
```
/mobile
  app/          # Expo Router routes
  components/   # Reusable UI
  hooks/        # Custom hooks
  services/     # API clients
  constants/    # Theme & constants
  assets/       # Images, fonts
```

## 3. Backend Architecture

- Next.js 14 (App Router)
- TypeScript
- REST APIs
- Deploy on Vercel

Structure:
```
/backend
  app/api/      # Route handlers
  lib/          # DB connection, auth, utils
  models/       # Mongoose schemas
  services/     # Business logic (media, AI, background removal)
  middleware/   # Auth, validation, rate limiting
  utils/        # Helpers
```

## 4. MongoDB Schema

Collections:
- users
- families
- familyMembers
- events
- eventMembers
- schedule
- tasks
- taskComments
- channels
- messages
- guests
- rsvps
- albums
- media
- documents
- expenses
- notifications
- invitations
- aiConversations
- aiMessages
- backgroundRemovalJobs
- designs
- templates

Key indexes: familyId, eventId, userId, createdAt.

## 5. API Design

REST endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/families
- POST /api/families
- GET /api/events
- POST /api/events
- GET /api/events/:id
- GET /api/events/:id/tasks
- POST /api/events/:id/tasks
- GET /api/events/:id/messages
- POST /api/events/:id/messages
- GET /api/events/:id/guests
- POST /api/events/:id/guests
- GET /api/events/:id/media
- POST /api/events/:id/media
- POST /api/media/remove-background
- GET /api/media/background-removal/:jobId
- GET /api/cutouts
- DELETE /api/cutouts/:id
- POST /api/designs
- GET /api/designs
- PUT /api/designs/:id
- POST /api/events/:id/ai/chat

## 6. Authentication

- JWT tokens (access + refresh)
- Secure mobile token storage (expo-secure-store / Keychain)
- Password hashing (bcrypt)
- Session persistence
- Profile setup flow

## 7. Authorization

Roles: ADMIN, ORGANIZER, MEMBER, GUEST
Backend enforces permissions. No frontend-only auth.

## 8. Media Storage

- Vercel Blob (preferred) or Cloudinary
- MongoDB stores metadata only
- Never store raw image/video binary in MongoDB

## 9. Background Removal Architecture

Mobile -> Upload -> Backend API -> Background Removal Service -> Transparent PNG/WebP -> Object Storage -> Return secure URL -> Mobile Preview

BackgroundRemovalService abstraction:
```ts
interface BackgroundRemovalService {
  removeBackground(image: Buffer | Blob): Promise<RemoveBackgroundResult>
}
```

Provider configurable via env vars.

## 10. AI Architecture

AI provider abstraction through backend APIs. Provider swappable.
- AI Family Assistant: queries real event data (authorized only)
- Never invent event info
- Backend authorization before sensitive data to AI

## 11. Deployment Architecture

- Backend: Vercel (serverless)
- MongoDB: Atlas (connection handling for serverless)
- Media: Vercel Blob or Cloudinary
- Push notifications: Expo + FCM/APNs

## 12. Environment Variables

Backend (.env.example):
- MONGODB_URI
- JWT_SECRET
- AI_API_KEY
- BLOB_STORAGE_TOKEN
- BACKGROUND_REMOVAL_API_KEY

Never commit actual secrets.