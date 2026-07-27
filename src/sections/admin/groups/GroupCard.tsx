import { useNavigate } from 'react-router-dom';
import { Box, CardActionArea, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Edit2, People, Trash } from 'iconsax-reactjs';

import MainCard from '@/components/extended/MainCard';
import StatusChip from '@/components/StatusChip';
import type { Group } from '@/types';

interface GroupCardProps {
  group: Group;
  onEdit: (g: Group) => void;
  onDelete: (g: Group) => void;
}

export default function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  const navigate = useNavigate();
  return (
    <MainCard contentSX={{ p: 0 }}>
      <CardActionArea onClick={() => navigate(`/admin/groups/${group.id}`)} sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h5" noWrap>{group.title}</Typography>
            <StatusChip label={group.status} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {group.description || 'No description'}
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center" color="text.secondary">
            <People size={16} />
            <Typography variant="caption">{group.memberCount ?? 0} members</Typography>
          </Stack>
        </Stack>
      </CardActionArea>
      <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ px: 1.5, pb: 1.5 }}>
        <Tooltip title="Edit">
          <IconButton size="small" color="secondary" onClick={() => onEdit(group)}><Edit2 size={16} /></IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={() => onDelete(group)}><Trash size={16} /></IconButton>
        </Tooltip>
      </Stack>
    </MainCard>
  );
}
