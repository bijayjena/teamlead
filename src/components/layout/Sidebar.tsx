import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Users, 
  BarChart3, 
  ChevronLeft,
  ChevronRight,
  Settings,
  Zap,
  LogOut,
  User,
  BookOpen,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { InvitationNotifications } from '@/components/team/InvitationNotifications';
import { TeamSwitcher } from '@/components/team/TeamSwitcher';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/team', label: 'Team Capacity', icon: Users },
  { path: '/team-members', label: 'Team Members', icon: UserPlus },
  { path: '/stakeholders', label: 'Reports', icon: BarChart3 },
  { path: '/meetings', label: 'Meetings', icon: BookOpen },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card/95 backdrop-blur-sm transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-gradient-to-r from-card to-card/80">
          {!collapsed && (
            <div className="flex items-center gap-2 flex-1 animate-in">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-lg glow">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-gradient">Team Lead</span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-lg glow mx-auto">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
          {!collapsed && <InvitationNotifications />}
        </div>

        {/* Team Switcher */}
        {!collapsed && (
          <div className="p-3 border-b border-border animate-slide-in-from-top">
            <TeamSwitcher />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            const linkContent = (
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out hover-lift",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm glow-hover" 
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:shadow-sm",
                  collapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="animate-in">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="border-border bg-popover">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        {/* User Profile & Actions */}
        <div className="border-t border-border p-3 space-y-2">
          {/* User Info */}
          <Link to="/settings" className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-muted/40",
            collapsed && "justify-center",
            location.pathname === '/settings' && "bg-primary/10"
          )}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </Link>

          {/* Logout Button */}
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="w-full justify-center text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="border-border bg-popover">
                Sign out
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          )}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center text-muted-foreground hover:text-foreground",
              !collapsed && "justify-start gap-3"
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};
