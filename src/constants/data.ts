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
    icon: 'layers',
    permission: "view-category",
    shortcut: ['c', 'c'],
  },
  {
    title: 'Products',
    url: '/products',
    icon: 'product',
    permission: "view-product",
    shortcut: ['p', 'r'],
  },
  {
    title: 'Stock',
    url: '#',
    icon: 'billing',
    isActive: false,
    permission: "view-stock",
    items: [
      {
        title: 'Stocks',
        url: '/stocks',
        icon: 'box',
        permission: "view-stock",
        shortcut: ['s', 'k'],
      },
      {
        title: 'Stock Adjustments',
        url: '/stock-adjustments',
        icon: 'sliders',
        permission: "view-stock-adjustment",
        shortcut: ['s', 'a'],
      }
    ]
  }
];

export const profileDropdownItems = [
  {
    permission: "view-profile",
    to: "/profile",
    translationKey: "Sidebar.Profile",
    shortcut: ['p', 'f'],
  },
  {
    permission: "view-settings",
    to: "/settings",
    translationKey: "Sidebar.Settings",
    shortcut: ['s', 't'],
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
