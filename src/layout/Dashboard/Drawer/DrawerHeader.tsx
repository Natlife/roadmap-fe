import { Box, Stack } from '@mui/material';

import LogoSection from '@/components/logo';
import { useMenu } from '@/contexts/MenuContext';

export default function DrawerHeader() {
  const { drawerOpen } = useMenu();
  return (
    <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: drawerOpen ? 2.5 : 0, justifyContent: drawerOpen ? 'flex-start' : 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" alignItems="center">
        <LogoSection isIcon={!drawerOpen} />
      </Stack>
    </Box>
  );
}
