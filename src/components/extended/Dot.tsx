import { Box, useTheme, type Theme } from '@mui/material';

interface DotProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: number;
}

export default function Dot({ color = 'primary', size = 8 }: DotProps) {
  const theme = useTheme();
  const main = (theme.palette[color] as { main?: string })?.main ?? (theme.palette.primary.main as string);
  return (
    <Box
      component="span"
      sx={(t: Theme) => ({
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: main,
        display: 'inline-block',
        boxShadow: `0 0 0 3px ${main}22`,
        flexShrink: 0,
        ml: t.spacing(0)
      })}
    />
  );
}
