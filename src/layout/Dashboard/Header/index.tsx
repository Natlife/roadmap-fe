import { AppBar, IconButton, Toolbar, useTheme } from '@mui/material';
import { HamburgerMenu } from 'iconsax-reactjs';

import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/config';
import { useMenu } from '@/contexts/MenuContext';
import HeaderContent from './HeaderContent';

export default function Header() {
  const theme = useTheme();
  const { drawerOpen, toggleDrawer } = useMenu();
  const width = drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        backdropFilter: 'blur(6px)',
        width: { xs: '100%', lg: `calc(100% - ${width}px)` },
        ml: { lg: `${width}px` },
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton color="secondary" edge="start" onClick={toggleDrawer} sx={{ mr: 1 }} aria-label="toggle menu">
          <HamburgerMenu size={20} />
        </IconButton>
        <HeaderContent />
      </Toolbar>
    </AppBar>
  );
}
