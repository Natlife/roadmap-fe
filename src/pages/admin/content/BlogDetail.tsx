import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { Backdrop, Box, Button, CircularProgress, Chip, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { Add, ArrowLeft, DocumentUpload } from 'iconsax-reactjs';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import NameDialog from '@/sections/admin/content/NameDialog';
import ContentRow from '@/sections/admin/content/ContentRow';
import SlideImportDialog, { type ParsedSlideItem } from '@/sections/admin/content/blocks/SlideImportDialog';
import { useTopic, useCreateStep, useDeleteStep } from '@/hooks/useContent';
import contentService from '@/services/contentService';
import { queryKeys } from '@/api/queryKeys';
import type { Step, StepBlock } from '@/types';

export default function BlogDetail() {
  const { topicId = '', blogId = '' } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: topic, isLoading } = useTopic(topicId);
  const createStep = useCreateStep(topicId);
  const deleteStep = useDeleteStep(topicId);

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Step | null>(null);
  const [importingSlideOpen, setImportingSlideOpen] = useState(false);
  const [processingPdf, setProcessingPdf] = useState(false);

  const blog = useMemo(() => topic?.lessons.find((l) => l.id === blogId), [topic, blogId]);

  const handleImportSlides = async (slides: ParsedSlideItem[]) => {
    if (slides.length === 0 || !blogId) return;

    setProcessingPdf(true);
    setImportingSlideOpen(false);
    enqueueSnackbar(`Đang tự động bóc tách ${slides.length} slide tạo các bước (Steps)...`, { variant: 'info' });

    try {
      let createdCount = 0;

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];

        // 1. Generate Step Title
        const rawText = slide.text.trim();
        const firstLine = rawText.split('\n')[0]?.trim();
        let stepTitle = `Slide ${slide.pageIndex}`;
        if (firstLine && firstLine.length > 0) {
          const cleanTitle = firstLine.replace(/^[#\s\-*]+/, '').slice(0, 70);
          if (cleanTitle) {
            stepTitle = `Slide ${slide.pageIndex}: ${cleanTitle}`;
          }
        }

        const summary = rawText ? rawText.slice(0, 150) : `Nội dung slide ${slide.pageIndex}`;

        // 2. Create new Step in current Blog/Lesson
        const newStepRes = await contentService.createStep({
          lessonId: blogId,
          title: stepTitle,
          summary
        });

        const newStepId = (newStepRes as { id?: string })?.id;

        // 3. Create content blocks inside the new Step (Image block + Text block)
        const blocks: StepBlock[] = [];

        if (slide.imageUrl) {
          blocks.push({
            ...contentService.makeBlock('IMAGE'),
            mediaUrl: slide.imageUrl,
            caption: `Slide ${slide.pageIndex}`
          });
        }

        if (slide.html || slide.text) {
          blocks.push({
            ...contentService.makeBlock('RICHTEXT'),
            body: slide.html || `<p>${slide.text.replace(/\n/g, '<br/>')}</p>`
          });
        }

        if (newStepId && blocks.length > 0) {
          await contentService.saveStepBlocks(newStepId, blocks);
        }

        createdCount++;
      }

      enqueueSnackbar(`Đã nạp thành công ${createdCount} Bước (Steps) từ file PDF Slide vào bài học!`, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.topic(topicId) });
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Có lỗi xảy ra khi nạp slide PDF', { variant: 'error' });
    } finally {
      setProcessingPdf(false);
    }
  };

  if (isLoading) return <Skeleton variant="rounded" height={280} />;

  return (
    <Box sx={{ position: 'relative' }}>
      <Breadcrumbs title="" />
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <IconButton color="secondary" onClick={() => navigate(`/admin/content/topics/${topicId}`)}>
          <ArrowLeft size={18} />
        </IconButton>
        <Typography variant="h3">{blog?.title}</Typography>
      </Stack>

      <MainCard
        title="Steps"
        secondary={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DocumentUpload size={18} />}
              onClick={() => setImportingSlideOpen(true)}
            >
              Import Slide PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<Add size={18} />}
              onClick={() => setCreating(true)}
            >
              New step
            </Button>
          </Stack>
        }
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
            {
              onSuccess: () => {
                enqueueSnackbar('Step created', { variant: 'success' });
                setCreating(false);
              },
              onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' })
            }
          )
        }
        onClose={() => setCreating(false)}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete step"
        description={`Delete "${deleting?.title}" and its content?`}
        loading={deleteStep.isPending}
        onConfirm={() =>
          deleting &&
          deleteStep.mutate(deleting.id, {
            onSuccess: () => {
              enqueueSnackbar('Step deleted', { variant: 'success' });
              setDeleting(null);
            },
            onError: (e) => enqueueSnackbar((e as Error).message || 'Failed', { variant: 'error' })
          })
        }
        onClose={() => setDeleting(null)}
      />

      <SlideImportDialog
        open={importingSlideOpen}
        onClose={() => setImportingSlideOpen(false)}
        onImport={handleImportSlides}
      />

      <Backdrop open={processingPdf} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="inherit" />
          <Typography variant="h6">Đang tự động bóc tách slide PDF ➔ tạo các bước (Steps)...</Typography>
        </Stack>
      </Backdrop>
    </Box>
  );
}
