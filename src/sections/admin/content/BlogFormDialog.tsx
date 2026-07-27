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
import { useCreateBlog, useUpdateBlog } from '@/hooks/useContent';
import type { ApiException } from '@/api/axios';
import type { AccessLevel, Blog, CreateBlogPayload } from '@/types';

interface BlogFormDialogProps {
  open: boolean;
  topicId: string;
  blog?: Blog | null;
  onClose: () => void;
}

const ACCESS_LEVELS: AccessLevel[] = ['FREE', 'PREMIUM', 'GROUP'];

export default function BlogFormDialog({ open, topicId, blog, onClose }: BlogFormDialogProps) {
  const isEdit = Boolean(blog);
  const createBlog = useCreateBlog(topicId);
  const updateBlog = useUpdateBlog(topicId);
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blog?.title ?? '',
      summary: blog?.summary ?? '',
      accessLevel: (blog?.accessLevel ?? 'FREE') as AccessLevel,
      allowedGroupIds: blog?.allowedGroupIds ?? ([] as string[]),
      estimatedMinutes: blog?.estimatedMinutes ?? 15
    },
    validationSchema: Yup.object({
      title: Yup.string().max(120).required('Title is required'),
      summary: Yup.string().max(500),
      accessLevel: Yup.string().required(),
      estimatedMinutes: Yup.number().min(1)
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const accessLevel = values.allowedGroupIds.length > 0 ? 'GROUP' : values.accessLevel;

      const payload: CreateBlogPayload = {
        topicId,
        title: values.title.trim(),
        summary: values.summary.trim(),
        accessLevel,
        allowedGroupIds: values.allowedGroupIds,
        estimatedMinutes: values.estimatedMinutes
      };

      try {
        if (isEdit && blog) {
          await updateBlog.mutateAsync({ id: blog.id, payload });
        } else {
          await createBlog.mutateAsync(payload);
        }
        enqueueSnackbar(isEdit ? 'Blog updated' : 'Blog created', { variant: 'success' });
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
        <DialogTitle>{isEdit ? 'Edit Blog' : 'New Blog'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Blog Title *</InputLabel>
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

            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Summary / Overview</InputLabel>
                <OutlinedInput
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Short description of what this blog covers..."
                  {...formik.getFieldProps('summary')}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <InputLabel>Estimated Reading Time (mins)</InputLabel>
                <OutlinedInput type="number" fullWidth {...formik.getFieldProps('estimatedMinutes')} />
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
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="secondary" onClick={onClose} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting || !formik.values.title.trim()}>
            {isEdit ? 'Save Changes' : 'Create Blog'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
