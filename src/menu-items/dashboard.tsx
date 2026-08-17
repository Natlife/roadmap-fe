import { Home3, Chart21 } from 'iconsax-reactjs';
import type { NavItemType } from '@/types/menu';

const dashboard: NavItemType = {
  id: 'group-dashboard',
  title: 'Overview',
  type: 'group',
  children: [
    { id: 'dashboard', title: 'Dashboard', type: 'item', url: '/dashboard', icon: Home3, breadcrumbs: false },
    { id: 'analytics', title: 'Analytics', type: 'item', url: '/analytics', icon: Chart21, roles: ['ADMIN'] }
  ]
};

export default dashboard;
