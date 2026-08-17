import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';

import LogoIcon from '@/components/logo/LogoIcon';
import ScrollTop from '@/components/ScrollTop';
import { APP_DEFAULT_PATH } from '@/config';

// Centered, minimal auth shell (Dokploy-style split-free login).
export default function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 0%, rgba(78,183,72,0.12), transparent 55%)'
            : 'radial-gradient(circle at 50% 0%, rgba(78,183,72,0.08), transparent 55%)',
        p: 2
      }}
    >
      <ScrollTop />
      <Stack spacing={2} alignItems="center" sx={{ width: '100%', maxWidth: 420 }}>
        <Stack spacing={0.5} alignItems="center">
          <ButtonBase
            disableRipple
            component={RouterLink}
            to={APP_DEFAULT_PATH}
            aria-label="logo"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              mx: 'auto'
            }}
          >
            <LogoIcon width={100} height={100} />
          </ButtonBase>
          <Typography
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 13.5,
              px: 2,
              lineHeight: 1.4
            }}
          >
            &ldquo;Master skills smarter, not harder &mdash; your roadmap to effortless mastery.&rdquo;
          </Typography>
        </Stack>
        <Outlet />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            component={RouterLink}
            to="/privacy"
            sx={{
              color: 'text.secondary',
              fontSize: 13,
              textDecoration: 'none',
              transition: 'color 0.2s',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
          >
            🔒 Chính sách quyền riêng tư (Privacy Policy)
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
