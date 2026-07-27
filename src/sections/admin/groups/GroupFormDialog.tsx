import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useCreateGroup, useUpdateGroup } from '@/hooks/useGroups';
import type { ApiException } from '@/api/axios';
import type { Group } from '@/types';

interface GroupFormDialogProps {
  open: boolean;
  group?: Group | null;
  onClose: () => void;
}

export default function GroupFormDialog({ open, group, onClose }: GroupFormDialogProps) {
  const isEdit = Boolean(group);
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: group?.title ?? '',
      description: group?.description ?? '',
      expiredAt: group?.expiredAt ? dayjs(group.expiredAt) : null
    },
    validationSchema: Yup.object({
      title: Yup.string().max(120).required('Title is required'),
      description: Yup.string().max(500)
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        title: values.title,
        description: values.description,
        expiredAt: values.expiredAt ? values.expiredAt.toISOString() : null
      };
      try {
        if (isEdit && group) {
          await updateGroup.mutateAsync({ id: group.id, payload });
          enqueueSnackbar('Group updated', { variant: 'success' });
        } else {
          await createGroup.mutateAsync(payload);
          enqueueSnackbar('Group created', { variant: 'success' });
        }
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
        <DialogTitle>{isEdit ? 'Edit group' : 'New group'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <InputLabel>Title</InputLabel>
              <OutlinedInput fullWidth {...formik.getFieldProps('title')} error={Boolean(formik.touched.title && formik.errors.title)} />
              {formik.touched.title && formik.errors.title && <FormHelperText error>{formik.errors.title}</FormHelperText>}
            </Stack>
            <Stack spacing={1}>
              <InputLabel>Description</InputLabel>
              <OutlinedInput fullWidth multiline minRows={3} {...formik.getFieldProps('description')} />
            </Stack>
            <Stack spacing={1}>
              <InputLabel>Expires at</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={formik.values.expiredAt}
                  onChange={(v) => formik.setFieldValue('expiredAt', v)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </LocalizationProvider>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            {isEdit ? 'Save changes' : 'Create group'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
