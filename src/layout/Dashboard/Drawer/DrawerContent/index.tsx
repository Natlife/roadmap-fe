import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Box } from '@mui/material';

import Navigation from './Navigation';

export default function DrawerContent() {
  return (
    <SimpleBar style={{ height: 'calc(100vh - 64px)' }}>
      <Box sx={{ pb: 2 }}>
        <Navigation />
      </Box>
    </SimpleBar>
  );
}
