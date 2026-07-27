import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack
} from '@mui/material';

import GroupSelect from '@/sections/admin/content/GroupSelect';
import TaxonomySelect from '@/sections/admin/content/TaxonomySelect';
import { useCreateTopic, useUpdateTopic } from '@/hooks/useContent';
import type { ApiException } from '@/api/axios';
import type { AccessLevel, CreateTopicPayload, Topic } from '@/types';

interface TopicFormDialogProps {
  open: boolean;
  topic?: Topic | null;
  onClose: () => void;
}

const EMOJI_OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'code', label: 'Code / Programming' },
  { value: 'launch', label: 'Launch / DevOps' },
  { value: 'book', label: 'General / Book' },
  { value: 'flash', label: 'Flash / Quick' },
  { value: 'tool', label: 'Tools / Build' },
  { value: 'globe', label: 'Web / Internet' },
  { value: 'mobile', label: 'Mobile / App' },
  { value: 'brain', label: 'AI / Research' },
];
const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const ACCESS_LEVELS: AccessLevel[] = ['FREE', 'PREMIUM', 'GROUP'];

export default function TopicFormDialog({ open, topic, onClose }: TopicFormDialogProps) {
  const isEdit = Boolean(topic);
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: topic?.title ?? '',
      description: topic?.description ?? '',
      emoji: topic?.emoji ?? 'book',
      levelLabel: topic?.levelLabel ?? 'Beginner',
      estimatedHours: topic?.estimatedHours ?? 4,
      accessLevel: (topic?.accessLevel ?? 'FREE') as AccessLevel,
      allowedGroupIds: topic?.allowedGroupIds ?? ([] as string[]),
      categoryIds: topic?.categoryIds ?? ([] as string[]),
      tagIds: topic?.tagIds ?? ([] as string[])
    },
    validationSchema: Yup.object({
      title: Yup.string().max(120).required('Title is required'),
      description: Yup.string().max(500),
      emoji: Yup.string().required('Emoji is required'),
      levelLabel: Yup.string().required(),
      estimatedHours: Yup.number().min(1),
      accessLevel: Yup.string().required()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const accessLevel = values.allowedGroupIds.length > 0 ? 'GROUP' : values.accessLevel;

      const payload: CreateTopicPayload = {
        title: values.title.trim(),
        description: values.description.trim(),
        emoji: values.emoji,
        levelLabel: values.levelLabel,
        estimatedHours: Number(values.estimatedHours),
        accessLevel,
        allowedGroupIds: values.allowedGroupIds,
        categoryIds: values.categoryIds,
        tagIds: values.tagIds
      };

      try {
        if (isEdit && topic) {
          await updateTopic.mutateAsync({ id: topic.id, payload });
        } else {
          await createTopic.mutateAsync(payload);
        }
        enqueueSnackbar(isEdit ? 'Topic updated' : 'Topic created', { variant: 'success' });
        onClose();
      } catch (err) {
        enqueueSnackbar((err as ApiException)?.message || 'Save failed', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (!open) formik.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Edit Topic' : 'New Topic'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Stack spacing={1}>
                <InputLabel>Topic Title *</InputLabel>
                <OutlinedInput
                  fullWidth
                  {...formik.getFieldProps('title')}
                  error={Boolean(formik.touched.title && formik.errors.title)}
                />
                {formik.touched.title && formik.errors.title && (
                  <FormHelperText error>{formik.errors.title}</FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack spacing={1}>
                <InputLabel>Emoji Icon</InputLabel>
                <Select {...formik.getFieldProps('emoji')}>
                  {EMOJI_OPTIONS.map((e) => (
                    <MenuItem key={e.value} value={e.value}>
                      {e.label}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Summary of what this topic teaches..."
                  {...formik.getFieldProps('description')}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack spacing={1}>
                <InputLabel>Level</InputLabel>
                <Select {...formik.getFieldProps('levelLabel')}>
                  {LEVEL_OPTIONS.map((l) => (
                    <MenuItem key={l} value={l}>
                      {l}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack spacing={1}>
                <InputLabel>Est. Hours</InputLabel>
                <OutlinedInput type="number" fullWidth {...formik.getFieldProps('estimatedHours')} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack spacing={1}>
                <InputLabel>Access Level</InputLabel>
                <Select
                  {...formik.getFieldProps('accessLevel')}
                  onChange={(e) => {
                    const newLevel = e.target.value as AccessLevel;
                    formik.setFieldValue('accessLevel', newLevel);
                    if (newLevel !== 'GROUP') {
                      formik.setFieldValue('allowedGroupIds', []);
                    }
                  }}
                >
                  {ACCESS_LEVELS.map((al) => (
                    <MenuItem key={al} value={al}>
                      {al}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <GroupSelect
                label="Target Learning Groups (Cohorts)"
                value={formik.values.allowedGroupIds}
                onChange={(selectedIds) => {
                  formik.setFieldValue('allowedGroupIds', selectedIds);
                  if (selectedIds.length > 0) {
                    formik.setFieldValue('accessLevel', 'GROUP');
                  } else if (formik.values.accessLevel === 'GROUP') {
                    formik.setFieldValue('accessLevel', 'FREE');
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TaxonomySelect
                kind="categories"
                label="Categories"
                value={formik.values.categoryIds}
                onChange={(val) => formik.setFieldValue('categoryIds', val)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TaxonomySelect
                kind="tags"
                label="Tags"
                value={formik.values.tagIds}
                onChange={(val) => formik.setFieldValue('tagIds', val)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="secondary" onClick={onClose} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting || !formik.values.title.trim()}>
            {isEdit ? 'Save Changes' : 'Create Topic'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
