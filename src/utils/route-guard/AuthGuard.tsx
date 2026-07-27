import { useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';
import Loader from '@/components/Loader';

// Blocks protected routes until the session is confirmed.
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isLoggedIn, isInitialized, navigate, location.pathname]);

  if (!isInitialized) return <Loader />;
  return isLoggedIn ? <>{children}</> : <Loader />;
}
