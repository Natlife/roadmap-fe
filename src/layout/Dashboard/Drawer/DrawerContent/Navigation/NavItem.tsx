import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';

import { useMenu } from '@/contexts/MenuContext';
import type { NavItemType } from '@/types/menu';

export default function NavItem({ item, level }: { item: NavItemType; level: number }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { drawerOpen, setDrawerOpen, setActiveItem } = useMenu();
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));

  const isSelected = pathname === item.url || pathname.startsWith(`${item.url}/`);
  const Icon = item.icon;

  return (
    <ListItemButton
      component={RouterLink}
      to={item.url ?? '#'}
      disabled={item.disabled}
      selected={isSelected}
      onClick={() => {
        setActiveItem(item.id);
        if (downLg) setDrawerOpen(false);
      }}
      sx={{
        pl: drawerOpen ? `${level * 16 + 12}px` : 1.5,
        py: 0.75,
        my: 0.25,
        mx: drawerOpen ? 1 : 0.75,
        minHeight: 40,
        justifyContent: drawerOpen ? 'flex-start' : 'center'
      }}
    >
      {Icon && (
        <ListItemIcon sx={{ minWidth: 30, color: 'text.secondary', justifyContent: 'center' }}>
          <Icon size={18} variant={isSelected ? 'Bold' : 'Linear'} />
        </ListItemIcon>
      )}
      {drawerOpen && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ fontWeight: isSelected ? 600 : 500 }}>
              {item.title}
            </Typography>
          }
        />
      )}
    </ListItemButton>
  );
}
