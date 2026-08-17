import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Button, Chip, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { Add, ArrowLeft } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import BlogFormDialog from '@/sections/admin/content/BlogFormDialog';
import ContentRow from '@/sections/admin/content/ContentRow';
import { useTopic, useDeleteBlog } from '@/hooks/useContent';
import type { Blog } from '@/types';

export default function TopicDetail() {
  const { topicId = '' } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: topic, isLoading } = useTopic(topicId);
  const deleteBlog = useDeleteBlog(topicId);
  const [creating, setCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState<Blog | null>(null);

  if (isLoading) return <Skeleton variant="rounded" height={280} />;

  return (
    <Box>
      <Breadcrumbs title="" />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <IconButton color="secondary" onClick={() => navigate('/admin/content')}><ArrowLeft size={18} /></IconButton>
        <Typography variant="h3">{topic?.title}</Typography>
      </Stack>

      <MainCard
        title="Blogs"
        secondary={<Button variant="contained" startIcon={<Add size={18} />} onClick={() => setCreating(true)}>New blog</Button>}
        contentSX={{ p: 0 }}
      >
        {!(topic?.lessons.length) && <EmptyState title="No blogs yet" description="Add a blog to group steps under this topic." />}
        {topic?.lessons.map((b) => (
          <ContentRow
            key={b.id}
            title={b.title}
            subtitle={b.summary || 'No summary'}
            meta={
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={b.code || `BLOG-${String(b.id).padStart(5, '0')}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontFamily: 'Roboto Mono, monospace', fontWeight: 700 }}
                />
                <Chip
                  size="small"
                  label={b.accessLevel || 'FREE'}
                  color={b.accessLevel === 'PREMIUM' ? 'warning' : 'success'}
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                <Chip size="small" variant="outlined" label={`${b.steps?.length || 0} steps`} />
              </Stack>
            }
            onOpen={() => navigate(`/admin/content/topics/${topicId}/blogs/${b.id}`)}
            onEdit={() => setEditingBlog(b)}
            onDelete={() => setDeleting(b)}
            deleteLabel={`Delete ${b.title}`}
          />
        ))}
      </MainCard>

      <BlogFormDialog
        open={creating || Boolean(editingBlog)}
        topicId={topicId}
        blog={editingBlog}
        onClose={() => { setCreating(false); setEditingBlog(null); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete blog"
        description={`Delete "${deleting?.title}" and all its steps?`}
        loading={deleteBlog.isPending}
        onConfirm={() => deleting && deleteBlog.mutate(deleting.id, { onSuccess: () => { enqueueSnackbar('Blog deleted', { variant: 'success' }); setDeleting(null); }, onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' }) })}
        onClose={() => setDeleting(null)}
      />
    </Box>
  );
}
