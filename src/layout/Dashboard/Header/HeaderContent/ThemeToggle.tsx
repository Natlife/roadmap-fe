import { IconButton, Tooltip } from '@mui/material';
import { Sun1, Moon } from 'iconsax-reactjs';

import useConfig from '@/hooks/useConfig';

export default function ThemeToggle() {
  const { mode, onToggleMode } = useConfig();
  const isDark = mode === 'dark';
  return (
    <Tooltip title={isDark ? 'Switch to light' : 'Switch to dark'}>
      <IconButton color="secondary" onClick={onToggleMode} aria-label="toggle theme">
        {isDark ? <Sun1 size={20} /> : <Moon size={20} />}
      </IconButton>
    </Tooltip>
  );
}
