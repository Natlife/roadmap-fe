import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { Profile2User, People, Chart, TickCircle } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import StatCard from '@/sections/dashboard/StatCard';
import useAuth from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import { useGroups } from '@/hooks/useGroups';

export default function Dashboard() {
  const theme = useTheme();
  const { user } = useAuth();
  const usersQuery = useUsers({ page: 1, pageSize: 1 });
  const groupsQuery = useGroups();

  const totalUsers = usersQuery.data?.meta.total;
  const totalGroups = groupsQuery.data?.length;
  const activeGroups = groupsQuery.data?.filter((g) => g.status === 'ACTIVE').length;

  return (
    <Box>
      <Breadcrumbs title={`Welcome back, ${user?.fullName?.split(' ')[0] ?? 'Admin'}`} />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total users" value={totalUsers} loading={usersQuery.isLoading} icon={<Profile2User size={22} />} color="primary" delta="Live" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total groups" value={totalGroups} loading={groupsQuery.isLoading} icon={<People size={22} />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Active groups" value={activeGroups} loading={groupsQuery.isLoading} icon={<TickCircle size={22} />} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Engagement" value="—" icon={<Chart size={22} />} color="warning" />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard title="New users (last 7 days)">
            <BarChart
              height={300}
              series={[{ data: [12, 19, 9, 22, 17, 25, 14], label: 'Signups', color: theme.palette.primary.main }]}
              xAxis={[{ data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], scaleType: 'band' }]}
              slotProps={{ legend: { hidden: true } as never }}
            />
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="Recent groups" sx={{ height: '100%' }}>
            <Stack spacing={1.5}>
              {(groupsQuery.data ?? []).slice(0, 5).map((g) => (
                <Stack key={g.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" noWrap>
                    {g.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {g.memberCount ?? 0} members
                  </Typography>
                </Stack>
              ))}
              {!groupsQuery.isLoading && !(groupsQuery.data ?? []).length && (
                <Typography variant="body2" color="text.secondary">
                  No groups yet.
                </Typography>
              )}
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}
