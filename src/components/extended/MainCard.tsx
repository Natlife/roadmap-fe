import { forwardRef, type ReactNode, type Ref } from 'react';
import { Card, CardContent, CardHeader, Divider, Typography, type CardProps, type SxProps, type Theme } from '@mui/material';

export interface MainCardProps extends Omit<CardProps, 'title' | 'content'> {
  border?: boolean;
  contentSX?: SxProps<Theme>;
  title?: ReactNode;
  subheader?: ReactNode;
  secondary?: ReactNode;
  content?: boolean;
  children?: ReactNode;
  divider?: boolean;
}

// The workhorse card surface used across every page.
const MainCard = forwardRef(
  (
    {
      border = true,
      children,
      content = true,
      contentSX = {},
      title,
      subheader,
      secondary,
      divider = true,
      sx = {},
      ...rest
    }: MainCardProps,
    ref: Ref<HTMLDivElement>
  ) => (
    <Card
      ref={ref}
      elevation={0}
      {...rest}
      sx={{ border: border ? '1px solid' : 'none', borderColor: 'divider', ...sx }}
    >
      {title && (
        <>
          <CardHeader
            title={typeof title === 'string' ? <Typography variant="h5">{title}</Typography> : title}
            subheader={subheader}
            action={secondary}
            sx={{ p: 2.5 }}
          />
          {divider && <Divider />}
        </>
      )}
      {content ? <CardContent sx={{ p: 2.5, ...contentSX }}>{children}</CardContent> : children}
    </Card>
  )
);

MainCard.displayName = 'MainCard';
export default MainCard;
