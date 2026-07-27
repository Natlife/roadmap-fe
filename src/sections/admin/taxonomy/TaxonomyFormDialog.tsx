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
  FormControlLabel,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch
} from '@mui/material';

import { useCreateTaxonomy, useUpdateTaxonomy } from '@/hooks/useTaxonomy';
import type { ApiException } from '@/api/axios';
import { TAXONOMY_LABEL, type TaxonomyItem, type TaxonomyKind } from '@/types';

interface Props {
  open: boolean;
  kind: TaxonomyKind;
  item?: TaxonomyItem | null;
  onClose: () => void;
}

export default function TaxonomyFormDialog({ open, kind, item, onClose }: Props) {
  const isEdit = Boolean(item);
  const label = TAXONOMY_LABEL[kind].singular;
  const createItem = useCreateTaxonomy(kind);
  const updateItem = useUpdateTaxonomy(kind);
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: item?.title ?? '',
      description: item?.description ?? '',
      active: item ? item.status === 1 : true
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().max(100, 'Max 100 characters').required('Title is required'),
      description: Yup.string().max(500, 'Max 500 characters')
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const payload = { title: values.title.trim(), description: values.description.trim(), status: values.active ? 1 : 0 };
      try {
        if (isEdit && item) await updateItem.mutateAsync({ id: item.id, payload });
        else await createItem.mutateAsync(payload);
        enqueueSnackbar(`${label} ${isEdit ? 'updated' : 'created'}`, { variant: 'success' });
        onClose();
      } catch (err) {
        const e = err as ApiException;
        if (e?.status === 409) setFieldError('title', e.message);
        enqueueSnackbar(e?.message || 'Save failed', { variant: 'error' });
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
        <DialogTitle>{isEdit ? `Edit ${label.toLowerCase()}` : `New ${label.toLowerCase()}`}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <InputLabel>Title</InputLabel>
              <OutlinedInput fullWidth {...formik.getFieldProps('title')} error={Boolean(formik.touched.title && formik.errors.title)} />
              {formik.touched.title && formik.errors.title && <FormHelperText error>{formik.errors.title}</FormHelperText>}
            </Stack>
            <Stack spacing={1}>
              <InputLabel>Description</InputLabel>
              <OutlinedInput fullWidth multiline minRows={3} {...formik.getFieldProps('description')} error={Boolean(formik.touched.description && formik.errors.description)} />
              {formik.touched.description && formik.errors.description && <FormHelperText error>{formik.errors.description}</FormHelperText>}
            </Stack>
            <FormControlLabel
              control={<Switch checked={formik.values.active} onChange={(e) => formik.setFieldValue('active', e.target.checked)} />}
              label={formik.values.active ? 'Active' : 'Inactive'}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            {isEdit ? 'Save changes' : `Create ${label.toLowerCase()}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
