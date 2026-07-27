import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { type ReactNode } from 'react';

import MainCard from '@/components/extended/MainCard';

interface StatCardProps {
  title: string;
  value?: number | string;
  icon: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'info';
  delta?: string;
  loading?: boolean;
}

export default function StatCard({ title, value, icon, color = 'primary', delta, loading }: StatCardProps) {
  return (
    <MainCard contentSX={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={72} height={36} />
          ) : (
            <Typography variant="h2">{value ?? '—'}</Typography>
          )}
          {delta && <Chip size="small" color={color === 'primary' ? 'success' : color} label={delta} />}
        </Stack>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.lighter`,
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>
      </Stack>
    </MainCard>
  );
}
