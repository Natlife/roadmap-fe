import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Button, Chip, Skeleton, Stack } from '@mui/material';
import { Add } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import TopicFormDialog from '@/sections/admin/content/TopicFormDialog';
import ContentRow from '@/sections/admin/content/ContentRow';
import { useTopics, useDeleteTopic } from '@/hooks/useContent';
import type { Topic } from '@/types';

export default function ContentTopics() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useTopics();
  const deleteTopic = useDeleteTopic();
  const [creating, setCreating] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState<Topic | null>(null);

  const topics = data ?? [];

  return (
    <Box>
      <Breadcrumbs title="Content" />
      <MainCard
        title="Topics"
        secondary={<Button variant="contained" startIcon={<Add size={18} />} onClick={() => setCreating(true)}>New topic</Button>}
        contentSX={{ p: 0 }}
      >
        {isLoading && <Stack sx={{ p: 2 }} spacing={1}>{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={40} />)}</Stack>}
        {!isLoading && topics.length === 0 && <EmptyState title="No topics yet" description="Create your first topic to start building content." />}
        {topics.map((t) => (
          <ContentRow
            key={t.id}
            title={`${t.emoji ? t.emoji + ' ' : ''}${t.title}`}
            subtitle={t.description || 'No description'}
            meta={
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={t.accessLevel || 'FREE'}
                  color={t.accessLevel === 'PREMIUM' ? 'warning' : 'success'}
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                <Chip size="small" variant="outlined" label={`${t.lessons?.length || 0} blogs`} />
              </Stack>
            }
            onOpen={() => navigate(`/admin/content/topics/${t.id}`)}
            onEdit={() => setEditingTopic(t)}
            onDelete={() => setDeleting(t)}
            deleteLabel={`Delete ${t.title}`}
          />
        ))}
      </MainCard>

      <TopicFormDialog
        open={creating || Boolean(editingTopic)}
        topic={editingTopic}
        onClose={() => { setCreating(false); setEditingTopic(null); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete topic"
        description={`Delete "${deleting?.title}" and all its blogs/steps? This cannot be undone.`}
        loading={deleteTopic.isPending}
        onConfirm={() =>
          deleting &&
          deleteTopic.mutate(deleting.id, {
            onSuccess: () => { enqueueSnackbar('Topic deleted', { variant: 'success' }); setDeleting(null); },
            onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' })
          })
        }
        onClose={() => setDeleting(null)}
      />
    </Box>
  );
}
