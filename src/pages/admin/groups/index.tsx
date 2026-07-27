import { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Button, Grid, InputAdornment, OutlinedInput, Skeleton, Stack } from '@mui/material';
import { Add, SearchNormal1 } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import GroupCard from '@/sections/admin/groups/GroupCard';
import GroupFormDialog from '@/sections/admin/groups/GroupFormDialog';
import { useGroups, useDeleteGroup } from '@/hooks/useGroups';
import type { Group } from '@/types';

export default function GroupsPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [deleting, setDeleting] = useState<Group | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGroups();
  const deleteGroup = useDeleteGroup();

  const filtered = useMemo(() => {
    const items = data ?? [];
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((g) => `${g.title} ${g.description}`.toLowerCase().includes(q));
  }, [data, search]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteGroup.mutateAsync(deleting.id);
      enqueueSnackbar('Group deleted', { variant: 'success' });
      setDeleting(null);
    } catch (err) {
      enqueueSnackbar((err as Error)?.message || 'Delete failed', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Breadcrumbs title="Groups" />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <OutlinedInput
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search groups…"
          startAdornment={
            <InputAdornment position="start">
              <SearchNormal1 size={16} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320, width: '100%' }}
        />
        <Button variant="contained" startIcon={<Add size={18} />} onClick={openCreate}>
          New group
        </Button>
      </Stack>

      {isLoading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Skeleton variant="rounded" height={160} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length ? (
        <Grid container spacing={2.5}>
          {filtered.map((g) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={g.id}>
              <GroupCard group={g} onEdit={(grp) => { setEditing(grp); setFormOpen(true); }} onDelete={setDeleting} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState title="No groups yet" description="Create your first learning group to organize members." action={<Button variant="contained" startIcon={<Add size={18} />} onClick={openCreate}>New group</Button>} />
      )}

      <GroupFormDialog open={formOpen} group={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete group"
        description={`"${deleting?.title ?? 'This group'}" will be soft-deleted. Member permissions assigned to this group will be updated.`}
        loading={deleteGroup.isPending}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </Box>
  );
}
