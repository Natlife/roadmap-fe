import { Avatar as MuiAvatar, type AvatarProps } from '@mui/material';

export interface ExtendedAvatarProps extends AvatarProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const SIZES: Record<NonNullable<ExtendedAvatarProps['size']>, number> = { xs: 24, sm: 32, md: 40, lg: 48 };

export default function Avatar({ color = 'primary', size = 'md', sx, children, ...rest }: ExtendedAvatarProps) {
  const dim = SIZES[size];
  return (
    <MuiAvatar
      sx={{
        width: dim,
        height: dim,
        fontSize: dim * 0.4,
        fontWeight: 600,
        bgcolor: `${color}.lighter`,
        color: `${color}.main`,
        ...sx
      }}
      {...rest}
    >
      {children}
    </MuiAvatar>
  );
}
