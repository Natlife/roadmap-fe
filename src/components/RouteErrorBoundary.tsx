import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Something went wrong';
  let detail = 'An unexpected error occurred while rendering this page.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail = (error.data as string) || detail;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'background.default' }}>
      <Paper sx={{ p: 4, maxWidth: 560, width: '100%', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={2}>
          <Typography variant="h3" color="error.main">{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Roboto Mono, monospace', whiteSpace: 'pre-wrap' }}>
            {detail}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
            <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>Reload</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
