import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll position on route change. MUST be rendered inside the router
// tree (e.g. within a layout), because it uses useLocation().
export default function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
