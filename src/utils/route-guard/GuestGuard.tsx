import { useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';
import Loader from '@/components/Loader';
import { APP_DEFAULT_PATH } from '@/config';

// Keeps authenticated users out of the login page.
export default function GuestGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      const from = (location.state as { from?: string })?.from || APP_DEFAULT_PATH;
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, isInitialized, navigate, location.state]);

  if (!isInitialized) return <Loader />;
  return !isLoggedIn ? <>{children}</> : <Loader />;
}
