import { Link, Stack, Typography } from '@mui/material';
import { APP_NAME } from '@/config';

export default function Footer() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{ px: { xs: 2, md: 3 }, py: 2, mt: 'auto' }}
    >
      <Typography variant="caption" color="text.secondary">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Link href="#" variant="caption" color="text.secondary">
          Docs
        </Link>
        <Link href="#" variant="caption" color="text.secondary">
          Support
        </Link>
      </Stack>
    </Stack>
  );
}
