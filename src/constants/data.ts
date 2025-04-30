import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    shortcut: ['d', 'd'],
    permission: "view-dashboard",
  },
  {
    title: 'Users',
    url: '/users',
    icon: 'userPen',
    permission: "view-user",
    shortcut: ['u', 'u'],
  },
  {
    title: 'Activity-logs',
    url: '/activity-logs',
    icon: 'userPen',
    permission: "view-activity-logs",
    shortcut: ['l', 'l'],
  },
  // {
  //   title: 'Accounts',
  //   url: '#',
  //   icon: 'billing',
  //   isActive: false,
  //   permission: "accounts",
  //   items: [
  //     {
  //       title: 'Users',
  //       url: '/users',
  //       icon: 'userPen',
  //       permission: "view-user",
  //       shortcut: ['u', 'u']
  //     },
  //   ]
  // },

];
