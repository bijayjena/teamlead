# Team Structure Redesign

## Overview

This redesign improves the team management system by:
1. Removing automatic team creation on signup (was causing issues)
2. Adding user settings to track active team
3. Adding functions to get all user teams (owned + member of)
4. Adding team switching functionality
5. Improving invitation acceptance to set active team

## Changes Made

### 1. Removed Automatic Team Creation

**Problem:** The trigger `on_user_create_default_team` was creating teams automatically but wasn't reliable and caused confusion.

**Solution:** Removed the trigger. Users will create their first team manually when needed.

### 2. Added User Settings Table

**New Table:** `user_settings`
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users, unique)
- `active_team_id` (UUID, references teams, nullable)
- `created_at`, `updated_at` (timestamps)

**Purpose:** Track which team is currently active for each user.

### 3. New Database Functions

#### `get_user_teams(user_uuid UUID)`

Returns all teams the user has access to (owned + member of):

```sql
SELECT * FROM get_user_teams(auth.uid());
```

**Returns:**
- `id` - Team ID
- `name` - Team name
- `owner_id` - Owner user ID
- `created_at`, `updated_at` - Timestamps
- `role` - User's role ('owner' or actual role from team_members)
- `is_owner` - Boolean indicating if user owns the team

#### `create_team_and_set_active(team_name TEXT, user_uuid UUID)`

Creates a new team and sets it as the user's active team:

```sql
SELECT create_team_and_set_active('My Team', auth.uid());
```

**Returns JSON:**
```json
{
  "success": true,
  "team_id": "uuid",
  "team_name": "My Team"
}
```

#### `switch_active_team(team_uuid UUID, user_uuid UUID)`

Switches the user's active team:

```sql
SELECT switch_active_team('team-uuid', auth.uid());
```

**Validates:** User has access to the team (owner or member)

**Returns JSON:**
```json
{
  "success": true,
  "team_id": "uuid"
}
```

### 4. Updated accept_invitation Function

Now automatically sets the joined team as active if the user has no active team yet.

## Migration File

**File:** `supabase/migrations/20260220130000_redesign_team_structure.sql`

**Includes:**
- Drop old trigger and function
- Create user_settings table
- RLS policies for user_settings
- New database functions
- Indexes for performance
- Updated accept_invitation function

## Implementation Changes Needed

### 1. Update useTeams Hook

Add new hooks:
- `useUserSettings()` - Get user's settings including active team
- `useAllUserTeams()` - Get all teams user has access to
- `useSwitchTeam()` - Switch active team
- `useCreateTeamAndSetActive()` - Create team and set as active

### 2. Update Team Pages

- Add team switcher dropdown in header
- Show active team indicator
- Allow creating first team if none exists
- Update team selection logic

### 3. Update Navigation

- Show active team name in sidebar
- Add team switcher in sidebar or header
- Update team-related queries to use active team

## Benefits

1. **Better UX:** Users can be members of multiple teams
2. **Team Switching:** Easy switching between teams
3. **Cleaner Signup:** No automatic team creation
4. **Active Team Context:** All operations use the active team
5. **Flexible Membership:** Users can own some teams and be members of others

## Migration Steps

1. Apply migration: `supabase db push`
2. Update hooks to use new functions
3. Update UI to show team switcher
4. Test team creation and switching
5. Test invitation acceptance with active team

## Future Enhancements

- Team switcher in sidebar
- Recent teams list
- Team favorites
- Team-specific settings
- Per-team notifications
- Team activity feed
