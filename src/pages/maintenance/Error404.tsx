import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function Error404() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 700, color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h4">Page not found</Typography>
        <Typography variant="body2" color="text.secondary">
          The page you are looking for doesn’t exist or was moved.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </Stack>
    </Box>
  );
}
