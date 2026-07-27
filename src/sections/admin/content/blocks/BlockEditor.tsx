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

const BLOCK_TYPES: BlockType[] = ['RICHTEXT', 'HEADING', 'CALLOUT', 'QUOTE', 'CODE', 'IMAGE', 'BULLETS'];

interface BlockEditorProps {
  blocks: StepBlock[];
  onChange: (blocks: StepBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [lastAddedUid, setLastAddedUid] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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
                defaultExpanded={b.uid === lastAddedUid || (blocks.length === 1 && idx === 0)}
                onChange={(p) => patch(b.uid, p)}
                onDelete={() => remove(b.uid)}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      <Button
        variant="outlined"
        color="secondary"
        startIcon={<Add size={18} />}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ alignSelf: 'flex-start', mt: 1 }}
      >
        Add block
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {BLOCK_TYPES.map((t) => (
          <MenuItem key={t} onClick={() => add(t)}>
            {BLOCK_LABEL[t]}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}
