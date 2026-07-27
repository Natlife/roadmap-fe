import { useState } from 'react';
import { Box, Checkbox, Chip, Divider, Radio, Stack, Typography } from '@mui/material';
import { ArrowLeft2, InfoCircle } from 'iconsax-reactjs';
import DOMPurify from 'dompurify';

import type { Step, StepBlock } from '@/types';

// Flutter App exact color palette (flutter_demo/lib/main.dart)
const C = {
  primary: '#124DA3',
  secondary: '#4EB748',
  tertiary: '#F37022',
  surface: '#F8FAFC',
  textDark: '#0F172A',
  textBody: '#334155',
  textMuted: '#64748B',
  border: '#E2E8F0',
  codeBg: '#0F172A'
};

function clean(html: string) {
  return DOMPurify.sanitize(html || '', {
    ALLOWED_TAGS: [
      'p', 'br', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'sub', 'sup',
      'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'hr', 'a', 'code',
      'pre', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'colspan', 'rowspan', 'class']
  });
}

const richStyles = {
  color: C.textBody,
  fontSize: 15,
  lineHeight: 1.82,
  fontFamily: 'Inter, sans-serif',
  '& p': { margin: '0 0 10px' },
  '& h1, & h2, & h3, & h4': { color: C.textDark, margin: '14px 0 8px', lineHeight: 1.3, fontWeight: 800 },
  '& ul, & ol': { paddingLeft: 20, margin: '8px 0' },
  '& a': { color: C.primary, textDecoration: 'none' },
  '& blockquote': { borderLeft: `3px solid #CBD5E1`, margin: '10px 0', paddingLeft: 14, color: '#475569', fontStyle: 'italic' },
  '& code': { background: '#E2E8F0', color: C.textDark, padding: '2px 5px', borderRadius: 4, fontFamily: 'monospace', fontSize: 13 },
  '& img': { maxWidth: '100%', borderRadius: 12 }
} as const;

function BlockView({ block }: { block: StepBlock }) {
  switch (block.type) {
    case 'HEADING':
      return (
        <Stack spacing={0.5}>
          {block.title && (
            <Typography sx={{ color: C.textDark, fontWeight: 800, fontSize: 20, lineHeight: 1.25 }}>
              {block.title}
            </Typography>
          )}
          {block.body && <Box sx={richStyles} dangerouslySetInnerHTML={{ __html: clean(block.body) }} />}
        </Stack>
      );

    case 'CALLOUT':
      return (
        <Box
          sx={{
            bgcolor: '#F8FAFC',
            border: `1px solid ${C.border}`,
            borderRadius: '14px',
            p: 2
          }}
        >
          {block.title && (
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.textDark, mb: 1 }}>{block.title}</Typography>
          )}
          {block.body && <Box sx={richStyles} dangerouslySetInnerHTML={{ __html: clean(block.body) }} />}
        </Box>
      );

    case 'QUOTE':
      return (
        <Box
          sx={{
            borderLeft: '3px solid #CBD5E1',
            pl: 2,
            py: 0.5,
            color: '#475569',
            fontStyle: 'italic'
          }}
        >
          <Box sx={richStyles} dangerouslySetInnerHTML={{ __html: clean(block.body ?? '') }} />
        </Box>
      );

    case 'CODE':
      return (
        <Box
          sx={{
            bgcolor: C.codeBg,
            borderRadius: '14px',
            p: 2.25,
            width: '100%'
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: 0.8,
              fontWeight: 700,
              color: '#93C5FD',
              textTransform: 'uppercase',
              mb: 1
            }}
          >
            {block.codeLanguage || 'TEXT'}
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              color: '#FFFFFF',
              fontFamily: 'monospace',
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {block.body}
          </Box>
        </Box>
      );

    case 'IMAGE':
      return (
        <Stack spacing={1}>
          {block.title && (
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: C.textDark }}>{block.title}</Typography>
          )}
          <Box
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              bgcolor: '#E2E8F0',
              aspectRatio: '16/9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {block.mediaUrl ? (
              <Box
                component="img"
                src={block.mediaUrl}
                alt={block.caption || 'Image'}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#475569' }}>Image block</Typography>
            )}
          </Box>
          {block.caption && (
            <Typography sx={{ fontSize: 13, color: C.textMuted, textAlign: 'center' }}>{block.caption}</Typography>
          )}
        </Stack>
      );

    case 'BULLETS':
      return (
        <Stack spacing={1}>
          {block.title && (
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: C.textDark }}>{block.title}</Typography>
          )}
          <Stack spacing={1}>
            {(block.items ?? []).filter(Boolean).map((it, i) => (
              <Stack key={i} direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#2563EB',
                    flexShrink: 0
                  }}
                />
                <Typography sx={{ fontSize: 14, lineHeight: 1.5, color: C.textBody }}>{it}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      );

    default: // RICHTEXT / PARAGRAPH
      return <Box sx={richStyles} dangerouslySetInnerHTML={{ __html: clean(block.body ?? '') }} />;
  }
}

interface StepPreviewProps {
  step: Partial<Step>;
  blocks: StepBlock[];
}

export default function StepPreview({ step, blocks }: StepPreviewProps) {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = step.checklist ?? [];
  const quizQuestions = step.quizQuestions ?? [];

  return (
    <Box sx={{ bgcolor: C.surface, minHeight: '100%', pb: 4 }}>
      {/* Flutter AppBar */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 2,
          pt: 4,
          pb: 1.5,
          bgcolor: C.surface,
          borderBottom: `1px solid ${C.border}`
        }}
      >
        <ArrowLeft2 size={20} color={C.textDark} />
        <Typography
          noWrap
          sx={{
            fontSize: 16,
            fontWeight: 700,
            color: C.textDark,
            flexGrow: 1
          }}
        >
          {step.title || 'Step Detail'}
        </Typography>
      </Stack>

      <Stack spacing={2.5} sx={{ p: 2.5 }}>
        {/* _StepHero Card */}
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '18px',
            border: `1px solid ${C.border}`,
            p: 2.5
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 800,
              color: C.textDark,
              lineHeight: 1.25
            }}
          >
            {step.title || 'Untitled Step'}
          </Typography>

          <Typography sx={{ fontSize: 14, color: C.textMuted, fontWeight: 600, mt: 0.75 }}>
            ⏱️ {step.estimatedMinutes ?? 10} min
          </Typography>

          {step.summary && (
            <Typography sx={{ fontSize: 15, lineHeight: 1.65, color: '#475569', mt: 1.25 }}>
              {step.summary}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={`${step.xpReward ?? 20} xp`}
              sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: 12 }}
            />
            <Chip
              size="small"
              label={step.accessLevel === 'PREMIUM' ? 'Premium' : 'Open'}
              sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: 12 }}
            />
            <Chip
              size="small"
              label={`${blocks.length} blocks`}
              sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: 12 }}
            />
          </Stack>
        </Box>

        {/* Learning Content Section Label */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontSize: 17, fontWeight: 800, color: C.textDark }}>Learning content</Typography>
            <InfoCircle size={16} color={C.textMuted} />
          </Stack>
          <Typography sx={{ fontSize: 13, color: C.textMuted, mt: 0.25 }}>
            This renderer is block-based so text, notes, images, audio, and code can be mixed freely later.
          </Typography>
        </Box>

        {/* Content Blocks */}
        {blocks.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
              bgcolor: '#FFFFFF',
              borderRadius: '16px',
              border: `1px solid ${C.border}`
            }}
          >
            <Typography sx={{ color: C.textMuted, fontSize: 13 }}>
              Add blocks in the editor to build learning content.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {blocks.map((b) => (
              <BlockView key={b.uid} block={b} />
            ))}
          </Stack>
        )}

        {/* Checklist Section */}
        {checklist.length > 0 && (
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: C.textDark }}>Checklist</Typography>
              <Typography sx={{ fontSize: 13, color: C.textMuted }}>
                Complete the practical items before moving on.
              </Typography>
            </Box>

            <Stack spacing={1}>
              {checklist.map((item) => {
                const isDone = Boolean(checkedIds[item.id]);
                return (
                  <Box
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: isDone ? '#F0FDF4' : '#FFFFFF',
                      border: `1px solid ${isDone ? C.secondary : C.border}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.25
                    }}
                  >
                    <Checkbox
                      checked={isDone}
                      size="small"
                      sx={{ p: 0, mt: 0.25, color: '#CBD5E1', '&.Mui-checked': { color: C.secondary } }}
                    />
                    <Typography
                      sx={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: isDone ? '#166534' : C.textBody,
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}

        {/* Quiz Section Preview */}
        {quizQuestions.length > 0 && (
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: C.textDark }}>
                Quiz Questions ({quizQuestions.length})
              </Typography>
              <Typography sx={{ fontSize: 13, color: C.textMuted }}>
                Learners will take this test after completing the checklist.
              </Typography>
            </Box>

            <Stack spacing={2}>
              {quizQuestions.map((q, qIdx) => (
                <Box
                  key={qIdx}
                  sx={{
                    p: 2,
                    bgcolor: '#FFFFFF',
                    borderRadius: '14px',
                    border: `1px solid ${C.border}`
                  }}
                >
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: C.textDark, mb: 1.25 }}>
                    Q{qIdx + 1}: {q.prompt || 'Untitled question'}
                  </Typography>
                  <Stack spacing={1}>
                    {q.options.map((opt, optIdx) => (
                      <Stack
                        key={optIdx}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: optIdx === q.correctIndex ? '#E0F2FE' : '#F8FAFC',
                          border: `1px solid ${optIdx === q.correctIndex ? '#1D4ED8' : 'transparent'}`
                        }}
                      >
                        <Radio size="small" checked={optIdx === q.correctIndex} sx={{ p: 0, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: 13, color: C.textBody }}>{opt}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Flutter Finish Button */}
        <Box
          sx={{
            bgcolor: quizQuestions.length > 0 ? '#7C3AED' : C.primary,
            color: '#FFFFFF',
            borderRadius: '12px',
            py: 1.75,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 15,
            boxShadow: '0 4px 12px rgba(18,77,163,0.25)'
          }}
        >
          {quizQuestions.length > 0 ? '🎯 Hoàn thành & Làm Quiz nhận thưởng' : '✅ Xác nhận hoàn thành'}
        </Box>
      </Stack>
    </Box>
  );
}
