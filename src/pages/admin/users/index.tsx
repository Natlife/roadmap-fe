import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Button, Chip, InputAdornment, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material';
import { Add, SearchNormal1 } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import UsersTable from '@/sections/admin/users/UsersTable';
import UserFormDialog from '@/sections/admin/users/UserFormDialog';
import useDebounce from '@/hooks/useDebounce';
import { useUsers, useSetUserActive } from '@/hooks/useUsers';
import type { ListParams, User, UserSortField } from '@/types';

type StatusFilter = 'active' | 'inactive' | 'all';

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 350);
  const [status, setStatus] = useState<StatusFilter>('active');
  const [plan, setPlan] = useState<ListParams['plan'] | 'ALL'>('ALL');
  const [role, setRole] = useState<ListParams['role'] | 'ALL'>('ALL');
  const [page, setPage] = useState(0); // zero-based
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<UserSortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [softTarget, setSoftTarget] = useState<User | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching } = useUsers({
    page: page + 1,
    pageSize,
    search: search.trim() || undefined,
    status,
    plan: plan === 'ALL' ? undefined : plan,
    role: role === 'ALL' ? undefined : role,
    sortBy,
    sortOrder
  });
  const setActive = useSetUserActive();

  const rows = data?.items ?? [];
  const total = data?.meta.total ?? 0;

  // reset to first page whenever a filter changes
  const resetPage = () => setPage(0);

  const handleSort = (field: UserSortField) => {
    if (sortBy === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(field);
      setSortOrder('asc');
    }
    resetPage();
  };

  const handleToggleActive = (user: User) => {
    if (user.active) {
      setSoftTarget(user);
    } else {
      setActive.mutate(
        { id: user.id, active: true },
        {
          onSuccess: () => enqueueSnackbar(`${user.fullName} reactivated`, { variant: 'success' }),
          onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' })
        }
      );
    }
  };

  const confirmSoftDelete = () => {
    if (!softTarget) return;
    setActive.mutate(
      { id: softTarget.id, active: false },
      {
        onSuccess: () => {
          enqueueSnackbar(`${softTarget.fullName} deleted`, { variant: 'success' });
          setSoftTarget(null);
        },
        onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' })
      }
    );
  };

  return (
    <Box>
      <Breadcrumbs title="Users" />

      <MainCard
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5">Users</Typography>
            <Chip size="small" variant="outlined" label={`${total} total`} />
          </Stack>
        }
        secondary={
          <Button variant="contained" startIcon={<Add size={18} />} onClick={() => { setEditing(null); setFormOpen(true); }}>
            New user
          </Button>
        }
        contentSX={{ p: 0 }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ p: 2.5 }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <OutlinedInput
            size="small"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); resetPage(); }}
            placeholder="Search name, email, username…"
            startAdornment={<InputAdornment position="start"><SearchNormal1 size={16} /></InputAdornment>}
            sx={{ maxWidth: { md: 340 }, width: '100%' }}
          />
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Select size="small" value={status} onChange={(e) => { setStatus(e.target.value as StatusFilter); resetPage(); }} sx={{ minWidth: 120 }}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="all">All statuses</MenuItem>
            </Select>
            <Select size="small" value={role} onChange={(e) => { setRole(e.target.value as ListParams['role'] | 'ALL'); resetPage(); }} sx={{ minWidth: 110 }}>
              <MenuItem value="ALL">All roles</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </Select>
            <Select size="small" value={plan} onChange={(e) => { setPlan(e.target.value as ListParams['plan'] | 'ALL'); resetPage(); }} sx={{ minWidth: 110 }}>
              <MenuItem value="ALL">All plans</MenuItem>
              <MenuItem value="FREE">Free</MenuItem>
              <MenuItem value="PREMIUM">Premium</MenuItem>
              <MenuItem value="GROUP">Group</MenuItem>
            </Select>
          </Stack>
        </Stack>

        <UsersTable
          data={rows}
          total={total}
          loading={isLoading || isFetching}
          page={page}
          pageSize={pageSize}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); resetPage(); }}
          onSortChange={handleSort}
          onEdit={(u) => { setEditing(u); setFormOpen(true); }}
          onToggleActive={handleToggleActive}
        />
      </MainCard>

      <UserFormDialog open={formOpen} user={editing} onClose={() => setFormOpen(false)} />

      <ConfirmDialog
        open={Boolean(softTarget)}
        title="Delete user"
        description={`${softTarget?.fullName ?? 'This user'} will be soft-deleted. They keep their data and can be reactivated anytime.`}
        confirmText="Delete"
        loading={setActive.isPending}
        onConfirm={confirmSoftDelete}
        onClose={() => setSoftTarget(null)}
      />
    </Box>
  );
}
