import { Stack, Typography } from '@mui/material';
import LogoIcon from './LogoIcon';
import { APP_NAME } from '@/config';

export default function LogoMain() {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <LogoIcon width={42} height={42} />
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 800,
          color: 'text.primary',
          letterSpacing: '-0.02em'
        }}
      >
        {APP_NAME}
      </Typography>
    </Stack>
  );
}
