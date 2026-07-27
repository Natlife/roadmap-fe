import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, ArrowDown2, DocumentUpload, HamburgerMenu, Trash } from 'iconsax-reactjs';

import RichTextEditor from '@/components/editor/RichTextEditor';
import contentService from '@/services/contentService';
import { BLOCK_LABEL, type StepBlock } from '@/types';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

const CODE_LANGS = ['javascript', 'typescript', 'dart', 'python', 'java', 'json', 'bash', 'sql', 'html', 'css', 'text'];

interface BlockCardProps {
  block: StepBlock;
  onChange: (patch: Partial<StepBlock>) => void;
  onDelete: () => void;
  defaultExpanded?: boolean;
  index?: number;
}

function getBlockPreview(block: StepBlock): string {
  if (block.title?.trim()) return block.title.trim();
  if (block.type === 'CODE') return block.body ? block.body.trim().slice(0, 40) + '...' : 'Code snippet';
  if (block.type === 'IMAGE') return block.caption || block.mediaUrl || 'Image block';
  if (block.type === 'BULLETS') {
    const list = (block.items ?? []).filter(Boolean);
    return list.length ? list.join(', ') : 'Bullet list';
  }
  if (block.body) {
    const text = block.body.replace(/<[^>]*>/g, '').trim();
    return text ? text.slice(0, 50) + (text.length > 50 ? '...' : '') : 'Text block';
  }
  return 'Empty block';
}

function BlockBody({ block, onChange }: { block: StepBlock; onChange: (p: Partial<StepBlock>) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
    if (!isValidImage) {
      alert('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF, SVG)');
      return;
    }

    setUploading(true);
    try {
      const res = await contentService.uploadImages([file]);
      if (res.urls && res.urls[0]) {
        onChange({ mediaUrl: res.urls[0] });
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setUploading(false);
    }
  };


  switch (block.type) {
    case 'HEADING':
      return (
        <TextField
          fullWidth
          size="small"
          placeholder="Heading text"
          value={block.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
          slotProps={{ htmlInput: { style: { fontWeight: 700, fontSize: '1.05rem' } } }}
        />
      );
    case 'CODE':
      return (
        <Stack spacing={1.5}>
          <TextField
            select
            size="small"
            label="Language"
            value={block.codeLanguage || 'javascript'}
            onChange={(e) => onChange({ codeLanguage: e.target.value })}
            sx={{ maxWidth: 200 }}
          >
            {CODE_LANGS.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="// Write code snippet here..."
            value={block.body ?? ''}
            onChange={(e) => onChange({ body: e.target.value })}
            slotProps={{ htmlInput: { style: { fontFamily: 'Roboto Mono, monospace', fontSize: '0.85rem' } } }}
          />
        </Stack>
      );
    case 'IMAGE':
      return (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              fullWidth
              size="small"
              label="Image URL"
              placeholder="https://... hoặc Google Drive share link"
              value={block.mediaUrl ?? ''}
              onChange={(e) => onChange({ mediaUrl: e.target.value })}
              helperText="Dán đường dẫn ảnh hoặc tải trực tiếp file từ máy tính"
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<DocumentUpload size={16} />}
              disabled={uploading}
              sx={{ flexShrink: 0, height: 40 }}
            >
              {uploading ? <CircularProgress size={18} /> : 'Tải ảnh từ máy'}
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.svg" hidden onChange={handleImageUpload} />

            </Button>
          </Stack>
          <TextField
            fullWidth
            size="small"
            label="Caption"
            value={block.caption ?? ''}
            onChange={(e) => onChange({ caption: e.target.value })}
          />
          {block.mediaUrl ? (
            <Box
              component="img"
              src={resolveImageUrl(block.mediaUrl)}
              alt={block.caption}
              sx={{ maxWidth: '100%', maxHeight: 220, borderRadius: 1, border: '1px solid', borderColor: 'divider', objectFit: 'cover' }}
            />
          ) : null}
        </Stack>
      );
    case 'BULLETS':

      return (
        <Stack spacing={1}>
          <TextField
            fullWidth
            size="small"
            label="List title (optional)"
            value={block.title ?? ''}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          {(block.items ?? []).map((it, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">•</Typography>
              <TextField
                fullWidth
                size="small"
                value={it}
                onChange={(e) => {
                  const items = [...(block.items ?? [])];
                  items[i] = e.target.value;
                  onChange({ items });
                }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => onChange({ items: (block.items ?? []).filter((_, idx) => idx !== i) })}
              >
                <Trash size={16} />
              </IconButton>
            </Stack>
          ))}
          <Box>
            <Button
              size="small"
              startIcon={<Add size={16} />}
              onClick={() => onChange({ items: [...(block.items ?? []), ''] })}
              sx={{ alignSelf: 'flex-start' }}
            >
              Add list item
            </Button>
          </Box>
        </Stack>
      );
    // RICHTEXT, CALLOUT, QUOTE -> rich text body
    default:
      return (
        <Stack spacing={1}>
          {(block.type === 'CALLOUT' || block.type === 'QUOTE') && (
            <TextField
              fullWidth
              size="small"
              label={`${BLOCK_LABEL[block.type]} title (optional)`}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          )}
          <RichTextEditor
            value={block.body ?? ''}
            onChange={(html) => onChange({ body: html })}
            placeholder={
              block.type === 'CALLOUT'
                ? 'Write callout content...'
                : block.type === 'QUOTE'
                  ? 'Write quote...'
                  : 'Write learning content...'
            }
          />
        </Stack>
      );
  }
}

export default function BlockCard({
  block,
  onChange,
  onDelete,
  defaultExpanded = false,
  index
}: BlockCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.uid });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative' as const
  };

  const preview = getBlockPreview(block);

  return (
    <Box ref={setNodeRef} style={style}>
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
        disableGutters
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: expanded ? 'primary.main' : 'divider',
          borderRadius: '8px !important',
          overflow: 'hidden',
          '&:first-of-type': { borderRadius: '8px !important' },
          '&:last-of-type': { borderRadius: '8px !important' },
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDown2 size={16} />}
          sx={{
            px: 1.5,
            py: 0.5,
            minHeight: 48,
            bgcolor: expanded ? 'action.hover' : 'transparent',
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 1.5,
              my: 0.5,
              overflow: 'hidden'
            }
          }}
        >
          {/* Drag Handle */}
          <Box
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            sx={{
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              p: 0.5,
              borderRadius: 0.5,
              touchAction: 'none',
              '&:hover': { color: 'primary.main', bgcolor: 'action.hover' }
            }}
            aria-label="Kéo thả để đổi thứ tự"
            title="Kéo thả để di chuyển khối này"
          >
            <HamburgerMenu size={18} />
          </Box>


          <Chip
            size="small"
            label={typeof index === 'number' ? `#${index + 1} ${BLOCK_LABEL[block.type]}` : BLOCK_LABEL[block.type]}
            color={block.type === 'HEADING' ? 'primary' : block.type === 'CALLOUT' ? 'warning' : 'default'}
            variant="outlined"
            sx={{ fontWeight: 600, flexShrink: 0 }}
          />

          {/* Snippet / Title Preview */}
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: preview.startsWith('Empty') ? 'text.disabled' : 'text.primary',
              fontWeight: 500,
              fontSize: '0.875rem',
              flexGrow: 1
            }}
          >
            {preview}
          </Typography>

          {/* Delete Icon Button */}
          <Tooltip title="Xóa block">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              sx={{ flexShrink: 0 }}
            >
              <Trash size={16} />
            </IconButton>
          </Tooltip>
        </AccordionSummary>


        <AccordionDetails sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <BlockBody block={block} onChange={onChange} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

