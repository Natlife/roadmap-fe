import { Chip } from '@mui/material';

type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

const MAP: Record<string, ChipColor> = {
  // account state
  ACTIVE: 'success',
  INACTIVE: 'default',
  // group state
  EXPIRED: 'error',
  // roles
  ADMIN: 'primary',
  USER: 'secondary',
  // plans (FREE | PREMIUM | GROUP)
  FREE: 'default',
  PREMIUM: 'warning',
  GROUP: 'info'
};

export default function StatusChip({ label }: { label?: string | number | boolean }) {
  const key = String(label ?? '').toUpperCase();
  return <Chip size="small" variant="outlined" color={MAP[key] ?? 'default'} label={key || '—'} />;
}
