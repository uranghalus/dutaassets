import type { LinkProps } from 'next/link';
import type React from 'react';

/* ===================== */
/* RBAC */
/* ===================== */

export type PermissionRequirement = {
  resource: string;
  action: string;
};

/* ===================== */
/* ACTION STATE */
/* ===================== */

export type ActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
};

/* ===================== */
/* SIDEBAR TYPES */
/* ===================== */

export type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  permission?: PermissionRequirement;
};

export type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {});
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: NavItem[];
  url?: never;
};

export type NavItem = NavLink | NavCollapsible;

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type SidebarData = {
  user?: User;
  teams: Team[];
  navGroups: NavGroup[];
};
