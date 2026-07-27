import { Profile2User, People, Category, Book1, Setting2, MessageQuestion } from 'iconsax-reactjs';
import type { NavItemType } from '@/types/menu';

const administration: NavItemType = {
  id: 'group-administration',
  title: 'Administration',
  type: 'group',
  roles: ['ADMIN'],
  children: [
    { id: 'plan-requests', title: 'Plan Requests', type: 'item', url: '/admin/plan-requests', icon: MessageQuestion, roles: ['ADMIN'] },
    { id: 'users', title: 'Users', type: 'item', url: '/admin/users', icon: Profile2User, roles: ['ADMIN'] },
    { id: 'groups', title: 'Groups', type: 'item', url: '/admin/groups', icon: People, roles: ['ADMIN'] },
    { id: 'taxonomy', title: 'Taxonomy', type: 'item', url: '/admin/taxonomy', icon: Category, roles: ['ADMIN'] },
    { id: 'content', title: 'Content', type: 'item', url: '/admin/content', icon: Book1, roles: ['ADMIN'] },
    { id: 'settings', title: 'Settings', type: 'item', url: '/settings', icon: Setting2, roles: ['ADMIN'] }
  ]
};

export default administration;
