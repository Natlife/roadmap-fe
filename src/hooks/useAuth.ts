import { useContext } from 'react';
import JWTContext from '@/contexts/JWTContext';

export default function useAuth() {
  const context = useContext(JWTContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
