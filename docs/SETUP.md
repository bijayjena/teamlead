# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd teamlead
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Run the database migrations (see Database Setup below)

### 4. Setup Gemini API

1. Get API key from https://makersuite.google.com/app/apikey
2. Add to environment variables

### 5. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_GEMINI_TEAMLEAD_KEY=your_gemini_api_key
```

### 6. Database Setup

The complete database schema is in `supabase/migrations/complete_schema.sql`.

Apply it to your Supabase project:

**Option A: Using Supabase CLI**
```bash
supabase db push
```

**Option B: Using Supabase Dashboard**
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/complete_schema.sql`
3. Paste and run the SQL

### 7. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

## Database Schema

The schema includes:
- User profiles and roles
- Teams and team members
- Team invitations
- Tasks and assignments
- Developers and capacity
- Milestones
- Meeting notes
- User settings

All tables have Row Level Security (RLS) enabled.

## Troubleshooting

### Supabase Connection Issues
- Verify your URL and key in `.env`
- Check if your Supabase project is active
- Ensure migrations are applied

### AI Features Not Working
- Verify Gemini API key is correct
- Check API quota limits
- Review browser console for errors

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Update dependencies: `npm update`

## Production Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your repository to Vercel
2. Framework preset: Vite
3. Add environment variables in Vercel dashboard

## Next Steps

1. Create your first team
2. Invite team members
3. Add developers
4. Create tasks
5. Try AI features

For more information, see [FEATURES.md](./FEATURES.md)
