import { Box, Stack, Typography } from '@mui/material';

import MainCard from '@/components/extended/MainCard';
import AuthLogin from '@/sections/auth/AuthLogin';

export default function Login() {
  return (
    <Box sx={{ width: '100%' }}>
      <MainCard sx={{ p: { xs: 2, sm: 1 } }} contentSX={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h3">Sign in</Typography>
          <Typography variant="body2" color="text.secondary">
            Admin console — enter your credentials to continue
          </Typography>
        </Stack>
        <AuthLogin />
      </MainCard>
    </Box>
  );
}
