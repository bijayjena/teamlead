# teamlead

## Project Overview

A comprehensive application for managing tasks, team members, stakeholders, and milestones with AI-powered features and team collaboration.

## Key Features

### Team Management
- **Team Invitations**: Invite members via email with role-based access
- **Member Management**: View, manage, and remove team members
- **Real-time Notifications**: Get notified of pending invitations
- **Role-based Access**: Admin, Team Lead, and Developer roles

See [TEAM_FEATURES.md](./TEAM_FEATURES.md) for detailed documentation.

## AI Features

teamlead includes powerful AI capabilities powered by Google's Gemini API:

- **AI Task Generation**: Convert natural language descriptions into structured tasks
- **Meeting Notes Analysis**: Automatically extract action items from meeting notes
- **Milestone Risk Analysis**: Get intelligent risk assessments for project milestones
- **Smart Task Recommendations**: AI-powered task assignment suggestions for developers

See [AI_FEATURES.md](./AI_FEATURES.md) for detailed documentation.

## Environment Setup

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_GEMINI_TEAMLEAD_KEY=your_gemini_api_key
```

## Getting Started

**Prerequisites**

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

**Local Development**

Clone this repo and install dependencies:

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

Build the project for production and deploy to your preferred hosting platform.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
