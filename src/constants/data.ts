import { NavItem } from "@/types";

export const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: '/',
      icon: 'dashboard',
      isActive: false,
      shortcut: ['d', 'd'],
      items: [] // Empty array as there are no child items for Dashboard
    },
    {
      title: 'Purchase Orders',
      url: '/purchase-orders',
      icon: 'user',
      shortcut: ['e', 'e'],
      isActive: false,
      items: [] // No child items
    },
    {
      title: 'Purchase Order Review',
      url: '/reviews',
      icon: 'product',
      shortcut: ['p', 'p'],
      isActive: false,
      items: [] // No child items
    },
    // {
    //   title: 'Account',
    //   url: '#', // Placeholder as there is no direct link for the parent
    //   icon: 'billing',
    //   isActive: true,
  
    //   items: [
    //     {
    //       title: 'Profile',
    //       url: '/dashboard/profile',
    //       icon: 'userPen',
    //       shortcut: ['m', 'm']
    //     },
    //     {
    //       title: 'Login',
    //       shortcut: ['l', 'l'],
    //       url: '/',
    //       icon: 'login'
    //     }
    //   ]
    // },
    // {
    //   title: 'Kanban',
    //   url: '/dashboard/kanban',
    //   icon: 'kanban',
    //   shortcut: ['k', 'k'],
    //   isActive: false,
    //   items: [] // No child items
    // }
  ];
  