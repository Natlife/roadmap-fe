import { Outlet } from 'react-router-dom';
import { Box, Container, Toolbar } from '@mui/material';

import useConfig from '@/hooks/useConfig';
import { MenuProvider } from '@/contexts/MenuContext';
import ScrollTop from '@/components/ScrollTop';
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';

function DashboardShell() {
  const { container } = useConfig();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ScrollTop />
      <Header />
      <Drawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{ flexGrow: 1, py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}
        >
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}

export default function DashboardLayout() {
  return (
    <MenuProvider>
      <DashboardShell />
    </MenuProvider>
  );
}
