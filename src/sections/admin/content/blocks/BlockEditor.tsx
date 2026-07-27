import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Menu, MenuItem, Stack } from '@mui/material';
import { Add } from 'iconsax-reactjs';

import contentService from '@/services/contentService';
import EmptyState from '@/components/EmptyState';
import { BLOCK_LABEL, type BlockType, type StepBlock } from '@/types';
import BlockCard from './BlockCard';

import { DocumentUpload, FolderAdd } from 'iconsax-reactjs';
import BulkImageDialog from './BulkImageDialog';
import SlideImportDialog from './SlideImportDialog';

const BLOCK_TYPES: BlockType[] = ['RICHTEXT', 'HEADING', 'CALLOUT', 'QUOTE', 'CODE', 'IMAGE', 'BULLETS'];

interface BlockEditorProps {
  blocks: StepBlock[];
  onChange: (blocks: StepBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [lastAddedUid, setLastAddedUid] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [slideOpen, setSlideOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const patch = (uid: string, p: Partial<StepBlock>) => onChange(blocks.map((b) => (b.uid === uid ? { ...b, ...p } : b)));
  const remove = (uid: string) => onChange(blocks.filter((b) => b.uid !== uid));

  const add = (type: BlockType) => {
    setAnchor(null);
    const newBlock = contentService.makeBlock(type);
    setLastAddedUid(newBlock.uid);
    onChange([...blocks, newBlock]);
  };

  const handleBulkImport = (urls: string[]) => {
    const newBlocks: StepBlock[] = urls.map((url) => ({
      ...contentService.makeBlock('IMAGE'),
      mediaUrl: url
    }));
    onChange([...blocks, ...newBlocks]);
  };

  const handleSlideImport = (newBlocks: StepBlock[]) => {
    onChange([...blocks, ...newBlocks]);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((b) => b.uid === active.id);
    const to = blocks.findIndex((b) => b.uid === over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(blocks, from, to));
  };

  return (
    <Stack spacing={1.5}>
      {blocks.length === 0 && (
        <EmptyState title="No content yet" description="Add your first block to start building this step." />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={blocks.map((b) => b.uid)} strategy={verticalListSortingStrategy}>
          <Stack spacing={1.5}>
            {blocks.map((b, idx) => (
              <BlockCard
                key={b.uid}
                block={b}
                index={idx}
                defaultExpanded={b.uid === lastAddedUid || (blocks.length === 1 && idx === 0)}
                onChange={(p) => patch(b.uid, p)}
                onDelete={() => remove(b.uid)}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Add size={18} />}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          Add block
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<FolderAdd size={18} />}
          onClick={() => setBulkOpen(true)}
        >
          Nạp ảnh từ Folder / Link
        </Button>
        <Button
          variant="contained"
          color="success"
          startIcon={<DocumentUpload size={18} />}
          onClick={() => setSlideOpen(true)}
        >
          Import Slide Bài Giảng (PDF ➔ Content)
        </Button>
      </Stack>

      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {BLOCK_TYPES.map((t) => (
          <MenuItem key={t} onClick={() => add(t)}>
            {BLOCK_LABEL[t]}
          </MenuItem>
        ))}
      </Menu>

      <BulkImageDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImport={handleBulkImport}
      />

      <SlideImportDialog
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        onImport={handleSlideImport}
      />
    </Stack>
  );
}


