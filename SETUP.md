# Relief-Zone Setup Guide

Relief-Zone is a bilingual psychotherapy patient management application supporting **Amharic** and **Afan Oromo** only.

## Prerequisites

- Node.js 18+ and npm/pnpm
- Neon PostgreSQL database
- Environment variables configured

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
JWT_SECRET=your-secure-random-string-here
NODE_ENV=development
```

Get your `DATABASE_URL` from your Neon project dashboard.

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Setup Database
This command will:
- Create all required tables
- Seed the Chill Zone with meditation and breathing exercise resources

```bash
npm run setup
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Troubleshooting

### Issue: "Registration Error" or "Cannot register"

**Solution**: The app requires the database to be set up first.

1. Ensure `DATABASE_URL` is set in `.env.local`
2. Run `npm run setup` to create tables and seed data
3. Clear your browser's localStorage and cache
4. Restart the development server: `npm run dev`
5. Try registering again

### Issue: "Module not found: bcrypt"

This was an earlier issue. If you encounter it:
1. Delete `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `npm install`
3. Run setup: `npm run setup`
4. Restart dev server: `npm run dev`

## User Roles

### Patient
- Access treatment plans, goals, and actions
- Use Chill Zone for relaxation (meditations, breathing exercises)
- Track mood with daily mood logging

### Therapist
- Manage assigned patients
- Create and monitor treatment plans
- Track goals and action items
- Add session notes and observations

## Languages

The application supports:
- **Amharic (አማርኛ)**
- **Afan Oromo (ኦሮሞ)**

Language can be switched in the navigation bar.

## Database Schema

The application uses Neon PostgreSQL with the following core tables:
- `users` - User accounts (patients & therapists)
- `patient_profiles` - Patient-specific information
- `therapist_profiles` - Therapist-specific information
- `treatment_plans` - Therapy treatment plans
- `goals` - Treatment goals
- `actions` - Action items for therapy
- `chill_zone_resources` - Meditation & breathing exercises
- `mood_logs` - Patient mood tracking
- `therapist_notes` - Session notes from therapists
- `sessions` - Therapy session records

## Testing the App

### Register as Patient:
1. Go to `/register`
2. Select "Patient" as role
3. Fill in details (use any email for testing)
4. Login with your credentials
5. Access patient dashboard with treatment plans, goals, actions, and Chill Zone

### Register as Therapist:
1. Go to `/register`
2. Select "Therapist" as role
3. Fill in details
4. Login with your credentials
5. Access therapist dashboard with patient management and note-taking features

## Features

### Patient Features
- ✅ View assigned treatment plans
- ✅ Track goals and progress
- ✅ Manage action items with checkbox completion
- ✅ Chill Zone: Meditations (5-20 minutes), breathing exercises, relaxation content
- ✅ Daily mood logging with 1-10 scale
- ✅ Bilingual interface (Amharic & Afan Oromo)

### Therapist Features
- ✅ View all assigned patients
- ✅ Create and manage treatment plans
- ✅ Create goals for patients
- ✅ Create and track action items
- ✅ Add session notes and observations
- ✅ Schedule and track therapy sessions
- ✅ Bilingual interface (Amharic & Afan Oromo)

## API Endpoints

All endpoints are JSON-based. Authentication uses JWT tokens in HTTP-only cookies.

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Treatment Data
- `GET/POST /api/treatment-plans` - Manage plans
- `GET/POST /api/goals` - Manage goals
- `GET/POST /api/actions` - Manage actions
- `PATCH /api/actions/[id]` - Update action status

### Chill Zone
- `GET /api/chill-zone` - Get meditations and breathing exercises

### Mood Tracking
- `GET/POST /api/mood-logs` - Track mood

### Therapist Routes
- `GET /api/therapist/patients` - Get assigned patients
- `POST /api/therapist/notes` - Add session notes
- `GET/POST /api/sessions` - Manage sessions

## Deployment

To deploy to Vercel:

```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Deploy via Vercel Dashboard
# Ensure DATABASE_URL and JWT_SECRET are set in Vercel project settings
```

## Support

For issues or questions, check:
1. `.env.local` is properly configured
2. Database is accessible (test with Neon console)
3. Try the troubleshooting section above
4. Clear cache and restart development server

---

**Relief-Zone** © 2024 - Psychotherapy Patient Management Application
