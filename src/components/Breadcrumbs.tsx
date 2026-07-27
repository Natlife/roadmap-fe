import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Link, Stack, Typography } from '@mui/material';
import { Home2, ArrowRight2 } from 'iconsax-reactjs';

const LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  admin: 'Administration',
  users: 'Users',
  groups: 'Groups',
  taxonomy: 'Taxonomy',
  content: 'Content',
  topics: 'Topic',
  blogs: 'Blog',
  steps: 'Step',
  analytics: 'Analytics',
  settings: 'Settings'
};

export default function Breadcrumbs({ title }: { title?: string }) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <Stack spacing={0.5} sx={{ mb: 2.5 }}>
      {title && <Typography variant="h3">{title}</Typography>}
      <MuiBreadcrumbs separator={<ArrowRight2 size={12} />} aria-label="breadcrumb">
        <Link component={RouterLink} to="/dashboard" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home2 size={14} />
        </Link>
        {segments.map((seg, idx) => {
          const to = `/${segments.slice(0, idx + 1).join('/')}`;
          const isLast = idx === segments.length - 1;
          const label = LABELS[seg] ?? seg;
          return isLast ? (
            <Typography key={to} variant="body2" color="text.primary">
              {label}
            </Typography>
          ) : (
            <Link key={to} component={RouterLink} to={to} variant="body2" color="text.secondary">
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Stack>
  );
}
