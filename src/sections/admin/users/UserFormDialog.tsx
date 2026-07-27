import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  Tooltip
} from '@mui/material';
import { InfoCircle } from 'iconsax-reactjs';

import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import type { ApiException } from '@/api/axios';
import type { CreateUserPayload, User, UserPlan, UserRole } from '@/types';

interface UserFormDialogProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
}

const ROLES: UserRole[] = ['ADMIN', 'USER'];
const PLANS: UserPlan[] = ['FREE', 'PREMIUM', 'GROUP'];

export default function UserFormDialog({ open, user, onClose }: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      username: user?.username ?? '',
      password: '',
      role: (user?.role ?? 'ADMIN') as UserRole,
      plan: (user?.plan ?? 'FREE') as UserPlan,
      active: user?.active ?? true
    },
    validationSchema: Yup.object({
      fullName: Yup.string().max(120).required('Full name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      username: Yup.string().max(60),
      password: isEdit
        ? Yup.string().test('minlen', 'Min 6 characters', (v) => !v || v.length >= 6)
        : Yup.string().min(6, 'Min 6 characters').required('Password is required'),
      role: Yup.string().oneOf(ROLES).required(),
      plan: Yup.string().oneOf(PLANS).required()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEdit && user) {
          await updateUser.mutateAsync({
            id: user.id,
            payload: {
              fullName: values.fullName,
              plan: values.plan,
              active: values.active,
              role: values.role,
              password: values.password || undefined
            }
          });
          enqueueSnackbar('User updated', { variant: 'success' });
        } else {
          const payload: CreateUserPayload = {
            email: values.email,
            username: values.username || undefined,
            fullName: values.fullName,
            password: values.password,
            role: values.role,
            plan: values.plan
          };
          await createUser.mutateAsync(payload);
          enqueueSnackbar('User created', { variant: 'success' });
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
        <DialogTitle>{isEdit ? 'Edit user' : 'New user'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <InputLabel>Full name</InputLabel>
                <OutlinedInput fullWidth {...formik.getFieldProps('fullName')} error={Boolean(formik.touched.fullName && formik.errors.fullName)} />
                {formik.touched.fullName && formik.errors.fullName && <FormHelperText error>{formik.errors.fullName}</FormHelperText>}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <InputLabel>Username</InputLabel>
                <OutlinedInput fullWidth placeholder="optional" disabled={isEdit} {...formik.getFieldProps('username')} />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>Email</InputLabel>
                <OutlinedInput fullWidth type="email" disabled={isEdit} {...formik.getFieldProps('email')} error={Boolean(formik.touched.email && formik.errors.email)} />
                {formik.touched.email && formik.errors.email && <FormHelperText error>{formik.errors.email}</FormHelperText>}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack spacing={1}>
                <InputLabel>{isEdit ? 'New password (leave blank to keep current)' : 'Password'}</InputLabel>
                <OutlinedInput
                  fullWidth
                  type="password"
                  placeholder={isEdit ? 'Leave blank to keep' : ''}
                  {...formik.getFieldProps('password')}
                  error={Boolean(formik.touched.password && formik.errors.password)}
                />
                {formik.touched.password && formik.errors.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <InputLabel>Role</InputLabel>
                <Select {...formik.getFieldProps('role')}>
                  {ROLES.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <InputLabel sx={{ mb: 0 }}>Plan</InputLabel>
                  <Tooltip
                    title="Gói GROUP được tự động kích hoạt khi thêm người dùng vào nhóm trong Quản lý Nhóm."
                    arrow
                    placement="top"
                  >
                    <IconButton size="small" color="info" sx={{ p: 0.25 }}>
                      <InfoCircle size={15} />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Select {...formik.getFieldProps('plan')}>
                  <MenuItem value="FREE">FREE</MenuItem>
                  <MenuItem value="PREMIUM">PREMIUM</MenuItem>
                  {formik.values.plan === 'GROUP' && (
                    <MenuItem value="GROUP">GROUP (Gán theo Nhóm)</MenuItem>
                  )}
                </Select>
              </Stack>
            </Grid>

            {isEdit && (
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.active}
                      onChange={(e) => formik.setFieldValue('active', e.target.checked)}
                    />
                  }
                  label={formik.values.active ? 'Active' : 'Inactive (soft-deleted)'}
                />
              </Grid>
            )}

            {isEdit && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="info" variant="outlined">
                  Email and username are set at creation and cannot be changed via the current API.
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            {isEdit ? 'Save changes' : 'Create user'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
