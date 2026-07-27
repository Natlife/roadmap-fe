import { Box } from '@mui/material';

import menuItems from '@/menu-items';
import useAuth from '@/hooks/useAuth';
import type { NavItemType } from '@/types/menu';
import NavGroup from './NavGroup';

function visibleFor(role: string | undefined, item: NavItemType) {
  if (!item.roles) return true;
  if (!role) return false;
  const normRole = role.toUpperCase().includes('ADMIN') ? 'ADMIN' : 'USER';
  return item.roles.includes(normRole as never);
}

export default function Navigation() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Box sx={{ pt: 1 }}>
      {menuItems.items
        .filter((group) => visibleFor(role, group))
        .map((group) => {
          const children = group.children?.filter((c) => visibleFor(role, c)) ?? [];
          if (!children.length) return null;
          return <NavGroup key={group.id} group={{ ...group, children }} />;
        })}
    </Box>
  );
}
