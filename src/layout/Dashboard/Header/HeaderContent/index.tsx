import { Box, Chip, Stack } from '@mui/material';

import ThemeToggle from './ThemeToggle';
import ProfileSection from './Profile';
import { APP_VERSION } from '@/config';

export default function HeaderContent() {
  return (
    <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
      <Box sx={{ flexGrow: 1 }} />
      <Chip
        label={`v${APP_VERSION}`}
        size="small"
        variant="outlined"
        sx={{ mr: 1.5, display: { xs: 'none', sm: 'flex' }, fontFamily: 'Roboto Mono, monospace' }}
      />
      <ThemeToggle />
      <ProfileSection />
    </Stack>
  );
}
