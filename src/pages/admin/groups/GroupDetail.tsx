import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ArrowLeft, Edit2, Trash, UserAdd } from 'iconsax-reactjs';

import MainCard from '@/components/extended/MainCard';
import Avatar from '@/components/extended/Avatar';
import StatusChip from '@/components/StatusChip';
import EmptyState from '@/components/EmptyState';
import GroupFormDialog from '@/sections/admin/groups/GroupFormDialog';
import { useGroup, useGroupMembers } from '@/hooks/useGroups';
import { useUsers } from '@/hooks/useUsers';
import type { User } from '@/types';

export default function GroupDetail() {
  const { groupId = '' } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const { data: group, isLoading } = useGroup(groupId);
  const { data: usersData } = useUsers({ page: 1, pageSize: 100 });
  const { addMember, removeMember } = useGroupMembers(groupId);

  const memberIds = useMemo(() => new Set((group?.members ?? []).map((m) => m.id)), [group]);
  const allUsers = usersData?.items ?? [];
  const userMap = useMemo(() => new Map(allUsers.map((u) => [u.id, u])), [allUsers]);
  const addable = useMemo(() => allUsers.filter((u) => !memberIds.has(u.id)), [allUsers, memberIds]);

  const handleAdd = async () => {
    if (!selected) return;
    try {
      await addMember.mutateAsync(selected.id);
      enqueueSnackbar('Member added', { variant: 'success' });
      setSelected(null);
    } catch (err) {
      enqueueSnackbar((err as Error)?.message || 'Failed to add member', { variant: 'error' });
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMember.mutateAsync(userId);
      enqueueSnackbar('Member removed', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar((err as Error)?.message || 'Failed to remove member', { variant: 'error' });
    }
  };

  if (isLoading) {
    return <Skeleton variant="rounded" height={320} />;
  }

  if (!group) {
    return <EmptyState title="Group not found" action={<Button onClick={() => navigate('/admin/groups')}>Back to groups</Button>} />;
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
        <IconButton onClick={() => navigate('/admin/groups')} color="secondary"><ArrowLeft size={18} /></IconButton>
        <Typography variant="h3">{group.title}</Typography>
        <StatusChip label={group.status} />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="secondary" startIcon={<Edit2 size={16} />} onClick={() => setEditOpen(true)}>
          Edit
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Details">
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Description</Typography>
                <Typography variant="body2">{group.description || '—'}</Typography>
              </Box>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Members</Typography>
                <Chip size="small" label={group.members?.length ?? 0} />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Expires</Typography>
                <Typography variant="body2">{group.expiredAt ? new Date(group.expiredAt).toLocaleDateString() : 'Never'}</Typography>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <MainCard title="Members" contentSX={{ p: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 2.5 }}>
              <Autocomplete
                size="small"
                fullWidth
                options={addable}
                value={selected}
                onChange={(_e, v) => setSelected(v)}
                getOptionLabel={(o) => `${o.fullName} (${o.email})`}
                renderInput={(params) => <TextField {...params} placeholder="Add a member…" />}
              />
              <Button variant="contained" startIcon={<UserAdd size={16} />} disabled={!selected || addMember.isPending} onClick={handleAdd}>
                Add
              </Button>
            </Stack>
            <Divider />
            {group.members?.length ? (
              <List sx={{ py: 0 }}>
                {group.members.map((m) => {
                  const u = userMap.get(m.id);
                  const name = m.fullName || u?.fullName || `User #${m.id}`;
                  const email = m.email || u?.email || '';
                  const initials = name
                    .trim()
                    .split(/\s+/)
                    .map((w) => w[0] || '')
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  return (
                    <ListItem
                      key={m.id}
                      divider
                      secondaryAction={
                        <Tooltip title="Remove from group">
                          <IconButton edge="end" color="error" onClick={() => handleRemove(m.id)} disabled={removeMember.isPending}>
                            <Trash size={16} />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <ListItemAvatar><Avatar size="sm">{initials}</Avatar></ListItemAvatar>
                      <ListItemText primary={name} secondary={email} />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <EmptyState title="No members" description="Add members using the selector above." />
            )}
          </MainCard>
        </Grid>
      </Grid>

      <GroupFormDialog open={editOpen} group={group} onClose={() => setEditOpen(false)} />
    </Box>
  );
}
