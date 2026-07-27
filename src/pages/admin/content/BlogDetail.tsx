import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Button, Chip, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { Add, ArrowLeft } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import NameDialog from '@/sections/admin/content/NameDialog';
import ContentRow from '@/sections/admin/content/ContentRow';
import { useTopic, useCreateStep, useDeleteStep } from '@/hooks/useContent';
import type { Step } from '@/types';

export default function BlogDetail() {
  const { topicId = '', blogId = '' } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: topic, isLoading } = useTopic(topicId);
  const createStep = useCreateStep(topicId);
  const deleteStep = useDeleteStep(topicId);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Step | null>(null);

  const blog = useMemo(() => topic?.lessons.find((l) => l.id === blogId), [topic, blogId]);

  if (isLoading) return <Skeleton variant="rounded" height={280} />;

  return (
    <Box>
      <Breadcrumbs title="" />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <IconButton color="secondary" onClick={() => navigate(`/admin/content/topics/${topicId}`)}><ArrowLeft size={18} /></IconButton>
        <Typography variant="h3">{blog?.title}</Typography>
      </Stack>

      <MainCard
        title="Steps"
        secondary={<Button variant="contained" startIcon={<Add size={18} />} onClick={() => setCreating(true)}>New step</Button>}
        contentSX={{ p: 0 }}
      >
        {!(blog?.steps.length) && <EmptyState title="No steps yet" description="Add a step, then open it to build its content." />}
        {blog?.steps.map((s) => (
          <ContentRow
            key={s.id}
            title={s.title}
            subtitle={s.summary}
            meta={<Chip size="small" variant="outlined" label={`${s.contentBlocks.length} blocks`} />}
            onOpen={() => navigate(`/admin/content/steps/${s.id}`)}
            onDelete={() => setDeleting(s)}
            deleteLabel={`Delete ${s.title}`}
          />
        ))}
      </MainCard>

      <NameDialog
        open={creating}
        title="New step"
        label="Step title"
        confirmText="Create step"
        loading={createStep.isPending}
        onSubmit={(title) =>
          createStep.mutate(
            { lessonId: blogId, title },
            { onSuccess: () => { enqueueSnackbar('Step created', { variant: 'success' }); setCreating(false); }, onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' }) }
          )
        }
        onClose={() => setCreating(false)}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete step"
        description={`Delete "${deleting?.title}" and its content?`}
        loading={deleteStep.isPending}
        onConfirm={() => deleting && deleteStep.mutate(deleting.id, { onSuccess: () => { enqueueSnackbar('Step deleted', { variant: 'success' }); setDeleting(null); }, onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' }) })}
        onClose={() => setDeleting(null)}
      />
    </Box>
  );
}
