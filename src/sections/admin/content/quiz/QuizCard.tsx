import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  InputLabel,
  OutlinedInput,
  Radio,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ArrowDown2, Trash } from 'iconsax-reactjs';

import type { StepQuizQuestion } from '@/types';

interface QuizCardProps {
  question: StepQuizQuestion;
  index: number;
  onChange: (patch: Partial<StepQuizQuestion>) => void;
  onDelete: () => void;
  defaultExpanded?: boolean;
}

export default function QuizCard({
  question,
  index,
  onChange,
  onDelete,
  defaultExpanded = false
}: QuizCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const promptPreview = question.prompt.trim()
    ? question.prompt.trim().slice(0, 50) + (question.prompt.length > 50 ? '...' : '')
    : 'Empty question prompt...';

  const correctOptionText = question.options[question.correctIndex] || '';

  return (
    <Box sx={{ borderRadius: 1, overflow: 'hidden' }}>
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
            px: 2,
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
          <Chip
            size="small"
            label={`Q${index + 1}`}
            color="secondary"
            sx={{ fontWeight: 700, flexShrink: 0 }}
          />

          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              color: question.prompt.trim() ? 'text.primary' : 'text.disabled',
              fontWeight: 600,
              flexGrow: 1
            }}
          >
            {promptPreview}
          </Typography>

          {correctOptionText && (
            <Chip
              size="small"
              variant="outlined"
              color="success"
              label={`✓ ${correctOptionText}`}
              sx={{ flexShrink: 0, maxWidth: 150, display: { xs: 'none', sm: 'inline-flex' } }}
            />
          )}

          <Tooltip title="Delete question">
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

        <AccordionDetails sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Stack spacing={2}>
            <Stack spacing={0.75}>
              <InputLabel>Question Prompt *</InputLabel>
              <OutlinedInput
                fullWidth
                size="small"
                placeholder="Enter question prompt..."
                value={question.prompt}
                onChange={(e) => onChange({ prompt: e.target.value })}
              />
            </Stack>

            <Stack spacing={1}>
              <InputLabel>Answer Options (Select radio for correct answer)</InputLabel>
              {question.options.map((opt, optIdx) => (
                <Stack key={optIdx} direction="row" alignItems="center" spacing={1}>
                  <Radio
                    checked={question.correctIndex === optIdx}
                    onChange={() => onChange({ correctIndex: optIdx })}
                    size="small"
                  />
                  <OutlinedInput
                    fullWidth
                    size="small"
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const opts = [...question.options];
                      opts[optIdx] = e.target.value;
                      onChange({ options: opts });
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
