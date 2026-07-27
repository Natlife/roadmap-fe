import { Drawer as MuiDrawer, useMediaQuery, useTheme } from '@mui/material';

import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '@/config';
import { useMenu } from '@/contexts/MenuContext';
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';

export default function Drawer() {
  const theme = useTheme();
  const { drawerOpen, setDrawerOpen } = useMenu();
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));

  const width = drawerOpen ? DRAWER_WIDTH : MINI_DRAWER_WIDTH;

  return (
    <MuiDrawer
      variant={downLg ? 'temporary' : 'permanent'}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: downLg ? DRAWER_WIDTH : width,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: downLg ? DRAWER_WIDTH : width,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        }
      }}
    >
      <DrawerHeader />
      <DrawerContent />
    </MuiDrawer>
  );
}
