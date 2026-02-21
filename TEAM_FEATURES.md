# Team Member Management Features

This document describes the team invitation and member management system implemented in teamlead.

## Overview

The team management system allows users to:
- Invite team members via email
- Accept/decline team invitations
- Manage team member roles
- View team member lists
- Receive notifications for pending invitations

## Database Schema

### Tables Created

1. **teams** - Team information
   - `id` (UUID, primary key)
   - `name` (text)
   - `owner_id` (UUID, references auth.users)
   - `created_at`, `updated_at` (timestamps)

2. **team_members** - Team membership
   - `id` (UUID, primary key)
   - `team_id` (UUID, references teams)
   - `user_id` (UUID, references auth.users)
   - `role` (app_role enum: admin, team_lead, developer)
   - `joined_at` (timestamp)

3. **team_invitations** - Pending invitations
   - `id` (UUID, primary key)
   - `team_id` (UUID, references teams)
   - `email` (text)
   - `role` (app_role enum)
   - `invited_by` (UUID, references auth.users)
   - `token` (text, unique)
   - `status` (pending, accepted, declined, expired)
   - `expires_at` (timestamp, 7 days from creation)
   - `created_at`, `updated_at` (timestamps)

### Roles

- **Admin**: Full access to manage team and settings
- **Team Lead**: Can manage tasks and team members
- **Developer**: Can view and work on assigned tasks

### Security (RLS Policies)

All tables have Row Level Security enabled with appropriate policies:
- Users can only view teams they own or are members of
- Only team owners can invite/remove members
- Invited users can view and respond to their invitations
- Team members can view other members of their teams

## Features

### 1. Automatic Team Creation

When a user signs up, a default team is automatically created for them with the name "{DisplayName}'s Team".

**Implementation:** Database trigger `on_user_create_default_team`

### 2. Team Member Invitation

**Location:** Team Members Page (`/team-members`)

**How it works:**
1. Click "Invite Team Member" button
2. Enter email address and select role
3. System generates unique invitation token
4. Invitation link is created: `/invite/{token}`
5. Link can be copied and shared directly
6. Invitation expires in 7 days

**Components:**
- `InviteTeamMemberDialog.tsx` - Invitation form and link generation
- `PendingInvitationsList.tsx` - List of pending invitations

**Features:**
- Copy invitation link to clipboard
- Cancel pending invitations
- View invitation expiry time
- Role selection (Admin, Team Lead, Developer)

### 3. Invitation Acceptance

**Location:** Invitation Page (`/invite/:token`)

**Flow:**
1. User clicks invitation link
2. If not signed in, prompted to sign in/sign up
3. System validates:
   - Token is valid
   - Invitation is pending (not already used)
   - Invitation hasn't expired
   - User's email matches invitation email
4. User can accept or decline
5. On accept: Added to team and redirected to Team Members page
6. On decline: Invitation marked as declined

**Components:**
- `InvitePage.tsx` - Invitation acceptance page

**Validation:**
- Email mismatch detection
- Expired invitation handling
- Already-used invitation detection
- Authentication requirement

### 4. Invitation Notifications

**Location:** Sidebar header (bell icon)

**Features:**
- Badge showing count of pending invitations
- Dropdown menu with invitation details
- Quick accept/decline actions
- "View" button to see full invitation details

**Components:**
- `InvitationNotifications.tsx` - Notification dropdown

**Auto-refresh:** Notifications update automatically when invitations are received

### 5. Team Members List

**Location:** Team Members Page (`/team-members`)

**Features:**
- View all team members
- See member roles and join dates
- Remove team members (owner only)
- Visual indicators for:
  - Current user ("You" badge)
  - Team owner (Crown icon)
  - Member roles (color-coded badges)

**Components:**
- `TeamMembersList.tsx` - Member list with management

**Permissions:**
- Only team owners can remove members
- Cannot remove yourself or the owner
- Members can view all team members

### 6. Team Statistics

**Location:** Team Members Page

**Metrics:**
- Total team members count
- Pending invitations count

## API Hooks

### useTeams.tsx

Comprehensive hooks for team management:

```typescript
// Queries
useTeams() - Get user's teams
useTeamMembers(teamId) - Get team members
useTeamInvitations(teamId) - Get team invitations
useMyInvitations() - Get user's pending invitations

// Mutations
useCreateTeam() - Create new team
useSendInvitation() - Send invitation
useAcceptInvitation() - Accept invitation
useDeclineInvitation() - Decline invitation
useRemoveTeamMember() - Remove member
useCancelInvitation() - Cancel pending invitation
```

## Navigation

New navigation items added:
- **Team Capacity** (`/team`) - Developer workload management
- **Team Members** (`/team-members`) - Member and invitation management

## User Experience

### For Team Owners:

1. **Inviting Members:**
   - Click "Invite Team Member"
   - Enter email and select role
   - Copy and share invitation link
   - Track pending invitations
   - Cancel invitations if needed

2. **Managing Members:**
   - View all team members
   - See roles and join dates
   - Remove members when necessary

### For Invited Users:

1. **Receiving Invitation:**
   - Receive invitation link via email or direct share
   - See notification badge in sidebar
   - View invitation details in dropdown

2. **Accepting Invitation:**
   - Click invitation link
   - Sign in if not authenticated
   - Review team and role details
   - Accept or decline invitation
   - Automatically join team on acceptance

## Security Features

1. **Token-based Invitations:**
   - Unique, unguessable tokens
   - 7-day expiration
   - One-time use

2. **Email Verification:**
   - Invitation email must match signed-in user
   - Prevents unauthorized access

3. **Row Level Security:**
   - Database-level access control
   - Users can only access their teams
   - Owners have full control

4. **Role-based Permissions:**
   - Different access levels
   - Owner-only actions protected
   - Member actions restricted

## Database Functions

### accept_invitation(invitation_token)

Accepts an invitation and adds user to team:
- Validates token and expiration
- Checks email match
- Adds user to team_members
- Updates invitation status
- Returns success/error JSON

### decline_invitation(invitation_token)

Declines an invitation:
- Validates token
- Checks email match
- Updates invitation status to 'declined'
- Returns success/error JSON

## Migration File

**File:** `supabase/migrations/20260220120000_add_team_invitations.sql`

**Includes:**
- Table creation
- RLS policies
- Indexes for performance
- Triggers for timestamps
- Database functions
- Default team creation trigger

## Testing Checklist

### Invitation Flow:
1. ✅ Create invitation with email and role
2. ✅ Copy invitation link
3. ✅ View pending invitations
4. ✅ Cancel invitation
5. ✅ Accept invitation (matching email)
6. ✅ Decline invitation
7. ✅ Handle expired invitations
8. ✅ Handle email mismatch
9. ✅ Require authentication

### Team Management:
1. ✅ View team members
2. ✅ See member roles
3. ✅ Remove team member (owner only)
4. ✅ View team statistics
5. ✅ Automatic team creation on signup

### Notifications:
1. ✅ Show pending invitation count
2. ✅ Display invitation details
3. ✅ Quick decline from dropdown
4. ✅ Navigate to full invitation page

## Future Enhancements

Potential features to add:
- Multiple teams per user
- Team switching
- Bulk invitations
- Invitation templates
- Email notifications (requires email service)
- Team settings and customization
- Member activity logs
- Team analytics
- Role permissions customization
- Invitation resending
- Team transfer (change owner)
