import { Box, Stack, Typography } from '@mui/material';
import { type ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({ title = 'No data', description, action, icon }: EmptyStateProps) {
  return (
    <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 8, px: 3, textAlign: 'center' }}>
      {icon && <Box sx={{ color: 'text.disabled', fontSize: 40 }}>{icon}</Box>}
      <Typography variant="h5">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {action}
    </Stack>
  );
}
