import { Box, Checkbox, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { ArrowRight2, Edit2, Trash } from 'iconsax-reactjs';
import { type ReactNode } from 'react';

interface ContentRowProps {
  title: string;
  subtitle?: ReactNode;
  meta?: ReactNode;
  onOpen: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  deleteLabel?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
}

export default function ContentRow({
  title,
  subtitle,
  meta,
  onOpen,
  onEdit,
  onDelete,
  deleteLabel,
  selectable = false,
  selected = false,
  onSelectChange
}: ContentRowProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-of-type': { borderBottom: 'none' },
        '&:hover': { bgcolor: 'action.hover' },
        ...(selected && { bgcolor: 'primary.lighter' })
      }}
    >
      {selectable && (
        <Checkbox
          size="small"
          checked={selected}
          onChange={(e) => onSelectChange?.(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0, cursor: 'pointer' }} onClick={onOpen}>
        <Typography variant="subtitle1" noWrap>
          {title || 'Untitled'}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        ) : null}
      </Box>

      {meta ? <Box sx={{ flexShrink: 0 }}>{meta}</Box> : null}

      {onEdit ? (
        <Tooltip title="Edit">
          <IconButton size="small" color="primary" aria-label={`Edit ${title}`} onClick={onEdit}>
            <Edit2 size={16} />
          </IconButton>
        </Tooltip>
      ) : null}

      <Tooltip title={deleteLabel || 'Delete'}>
        <IconButton size="small" color="error" aria-label={deleteLabel || `Delete ${title}`} onClick={onDelete}>
          <Trash size={16} />
        </IconButton>
      </Tooltip>

      <IconButton size="small" color="secondary" aria-label={`Open ${title}`} onClick={onOpen}>
        <ArrowRight2 size={16} />
      </IconButton>
    </Stack>
  );
}
