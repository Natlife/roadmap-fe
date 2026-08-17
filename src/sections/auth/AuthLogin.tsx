import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import { Eye, EyeSlash } from 'iconsax-reactjs';

import useAuth from '@/hooks/useAuth';
import { APP_DEFAULT_PATH } from '@/config';
import type { ApiException } from '@/api/axios';

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().max(255).required('Password is required')
});

export default function AuthLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '', submit: null as string | null },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      try {
        const user = await login({ email: values.email, password: values.password });
        enqueueSnackbar('Welcome back!', { variant: 'success' });
        const isAdmin = user?.role ? user.role.toUpperCase().includes('ADMIN') : false;
        if (!isAdmin) {
          navigate('/403', { replace: true });
        } else {
          const from = (location.state as { from?: string })?.from || APP_DEFAULT_PATH;
          navigate(from, { replace: true });
        }
      } catch (err) {
        const message = (err as ApiException)?.message || 'Login failed';
        setFieldValue('submit', message);
        enqueueSnackbar(message, { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <InputLabel htmlFor="email">Email address</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            fullWidth
            placeholder="admin@roadmap.io"
            {...formik.getFieldProps('email')}
            error={Boolean(formik.touched.email && formik.errors.email)}
          />
          {formik.touched.email && formik.errors.email && (
            <FormHelperText error>{formik.errors.email}</FormHelperText>
          )}
        </Stack>

        <Stack spacing={1}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            placeholder="••••••••"
            {...formik.getFieldProps('password')}
            error={Boolean(formik.touched.password && formik.errors.password)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword((s) => !s)} size="small">
                  {showPassword ? <Eye size={18} /> : <EyeSlash size={18} />}
                </IconButton>
              </InputAdornment>
            }
          />
          {formik.touched.password && formik.errors.password && (
            <FormHelperText error>{formik.errors.password}</FormHelperText>
          )}
        </Stack>

        {formik.values.submit && <Alert severity="error">{formik.values.submit}</Alert>}

        <Button type="submit" fullWidth size="large" variant="contained" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  );
}
