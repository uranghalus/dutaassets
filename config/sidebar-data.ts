import {
  LayoutDashboard,
  ListTodo,
  Command,
  FireExtinguisher,
  DatabaseZap,
  UserCog2,
  AppWindowMac,
  Building2,
  Users,
} from 'lucide-react';
// import { ClerkLogo } from '@/assets/clerk-logo';
import { SidebarData } from '@/types';

export const sidebarData: SidebarData = {
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },

        {
          title: 'Teams',
          icon: Users,
          items: [
            { url: '/teams', title: 'Team List' },
            { url: '/teams/members', title: 'Team Members' },
            { url: '/teams/permissions', title: 'Permissions' },
          ],
        },
      ],
    },
  ],
};
