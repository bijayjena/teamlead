# teamlead

A comprehensive team management and task tracking application with AI-powered features and robust team collaboration capabilities.

## 🌟 Key Features

### Task Management
- Kanban board with drag-and-drop
- AI-powered task generation from natural language
- Manual task creation with full details
- Task assignment and tracking
- Priority and skill-based organization

### Team Management
- **Multi-team Support**: Create and join multiple teams
- **Team Switching**: Easy switching between teams
- **Invitation System**: Email-based invitations with role assignment
- **Member Management**: Add, remove, and manage team members
- **Real-time Notifications**: Get notified of pending invitations

### AI Features
- **AI Task Generation**: Convert descriptions into structured tasks
- **Meeting Notes Analysis**: Extract action items from meeting notes
- **Milestone Risk Analysis**: Get intelligent risk assessments
- **Smart Task Recommendations**: AI-powered task assignment suggestions

### Team Capacity
- Developer workload tracking
- Capacity visualization
- Skill management
- Overload warnings

### Reports & Analytics
- Milestone tracking
- Progress visualization
- Export to Excel/CSV
- Shareable reports

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md) - Installation and configuration
- [Features Overview](./docs/FEATURES.md) - Complete feature documentation
- [AI Features](./docs/AI_FEATURES.md) - AI capabilities and usage
- [UI Guide](./docs/UI_GUIDE.md) - Design system and animations

## 🚀 Quick Start

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd teamlead

# Install dependencies
npm install

# Create .env file with your credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
# VITE_GEMINI_TEAMLEAD_KEY=your_gemini_api_key

# Run database migrations (see docs/SETUP.md)
# Then start the dev server
npm run dev
```

For detailed setup instructions including Supabase configuration, see [Setup Guide](./docs/SETUP.md).

## 🚀 Ready to Deploy?

**Quick Deploy (10 minutes)**: See [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)

**Before Launch Checklist**: See [TODO_BEFORE_LAUNCH.md](./TODO_BEFORE_LAUNCH.md)

Your app is already optimized and configured for production with:
- ✅ Netlify configuration ready
- ✅ SEO optimization complete
- ✅ Performance optimizations applied
- ✅ Security headers configured
- ✅ PWA manifest ready

Just add your favicons and deploy!

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite
- Supabase (PostgreSQL + Auth)
- Google Gemini AI
- shadcn/ui + Tailwind CSS
- TanStack Query

## 📦 Database Setup

The complete database schema is available in `supabase/migrations/complete_schema.sql`. This single file contains:
- All table definitions
- Row Level Security policies
- Database functions and triggers
- Indexes for performance

To set up a new Supabase project:
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the complete schema: `supabase db push`
3. Add your Supabase credentials to `.env`

See [Setup Guide](./docs/SETUP.md) for detailed instructions.

## 📄 Documentation

### 🚀 Deployment & Production
- **[📋 TODO Before Launch](./TODO_BEFORE_LAUNCH.md)** - 15-minute pre-launch checklist ⭐ START HERE
- **[⚡ Quick Start Deployment](./QUICK_START_DEPLOYMENT.md)** - Deploy in 10 minutes
- **[📖 Complete Deployment Guide](./DEPLOYMENT.md)** - Comprehensive deployment process
- **[✅ Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step verification
- **[🔄 Deployment Flow](./DEPLOYMENT_FLOW.md)** - Visual architecture diagrams
- **[📊 Production Ready Summary](./PRODUCTION_READY_SUMMARY.md)** - What's been implemented
- **[🎯 Lighthouse Optimization](./LIGHTHOUSE_OPTIMIZATION.md)** - Performance tuning guide
- **[🔍 SEO Guide](./SEO_GUIDE.md)** - SEO and social media optimization

### 🎨 Assets & Branding
- **[public/ASSETS_README.md](./public/ASSETS_README.md)** - Logo and favicon setup
- **[scripts/generate-favicons.md](./scripts/generate-favicons.md)** - Favicon generation guide

### 📚 Features & Development
- **[Setup Guide](./docs/SETUP.md)** - Installation and configuration
- **[Features Overview](./docs/FEATURES.md)** - Complete feature documentation
- **[AI Features](./docs/AI_FEATURES.md)** - AI capabilities and usage
- **[UI Guide](./docs/UI_GUIDE.md)** - Design system and animations

### 📑 Complete Index
- **[📚 Documentation Index](./DOCUMENTATION_INDEX.md)** - Complete guide to all documentation

## 🚀 Deployment

```sh
npm run build
```

Deploy the `dist` folder to your preferred hosting platform (Vercel, Netlify, etc.).
