import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import useConfig from '@/hooks/useConfig';

interface MenuContextValue {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  activeItem: string;
  setActiveItem: (id: string) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const { miniDrawer } = useConfig();
  const [drawerOpen, setDrawerOpen] = useState(!miniDrawer);
  const [activeItem, setActiveItem] = useState('dashboard');

  const value = useMemo(
    () => ({
      drawerOpen,
      setDrawerOpen,
      toggleDrawer: () => setDrawerOpen((o) => !o),
      activeItem,
      setActiveItem
    }),
    [drawerOpen, activeItem]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within <MenuProvider>');
  return ctx;
}

export default MenuContext;
