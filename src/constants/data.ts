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
    title: 'Categories',
    url: '/categories',
    icon: 'userPen',
    permission: "view-category",
    shortcut: ['c', 'c'],
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
export const profileDropdownItems = [
  {
    permission: "view-profile",
    to: "/profile",
    translationKey: "Sidebar.Profile",
    shortcut: ['p', 'p'],
  },
  {
    permission: "view-settings",
    to: "/settings",
    translationKey: "Sidebar.Settings",
    shortcut: ['s', 's'],
  },
  {
    permission: "view-user",
    to: "/users",
    translationKey: "Sidebar.Users",
    shortcut: ['u', 'u'],
  },
  {
    permission: "view-activity-logs",
    to: "/activity-logs",
    translationKey: "Sidebar.Activity-logs",
    shortcut: ['l', 'l'],
  },
];