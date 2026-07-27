import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { Add, ArrowLeft, DocumentText1, Trash } from 'iconsax-reactjs';

import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import MainCard from '@/components/extended/MainCard';
import QuizCard from '@/sections/admin/content/quiz/QuizCard';
import BlockEditor from '@/sections/admin/content/blocks/BlockEditor';
import PhoneFrame from '@/sections/admin/content/preview/PhoneFrame';
import StepPreview from '@/sections/admin/content/preview/StepPreview';
import contentService from '@/services/contentService';
import { useStep, useSaveStepBlocks } from '@/hooks/useContent';
import type { AccessLevel, StepBlock, StepChecklistItem, StepQuizQuestion } from '@/types';

export default function StepEditor() {
  const { stepId = '' } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: step, isLoading } = useStep(stepId);
  const saveBlocks = useSaveStepBlocks(stepId);

  const [activeTab, setActiveTab] = useState(0);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(10);
  const [xpReward, setXpReward] = useState(20);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('FREE');
  const [blocks, setBlocks] = useState<StepBlock[]>([]);
  const [checklist, setChecklist] = useState<StepChecklistItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<StepQuizQuestion[]>([]);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (step) {
      setTitle(step.title || '');
      setSummary(step.summary || '');
      setEstimatedMinutes(step.estimatedMinutes ?? 10);
      setXpReward(step.xpReward ?? 20);
      setAccessLevel(step.accessLevel || 'FREE');
      setBlocks(step.contentBlocks || []);
      setChecklist(step.checklist || []);
      setQuizQuestions(step.quizQuestions || []);
      setDirty(false);
    }
  }, [step]);

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
  };

  const addChecklistItem = () => {
    const newItem: StepChecklistItem = { id: `c_${Date.now()}`, text: '' };
    setChecklist((prev) => [...prev, newItem]);
    setDirty(true);
  };

  const updateChecklistItem = (idx: number, text: string) => {
    setChecklist((prev) => {
      const list = [...prev];
      list[idx] = { ...list[idx], text };
      return list;
    });
    setDirty(true);
  };

  const removeChecklistItem = (idx: number) => {
    setChecklist((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const addQuizQuestion = () => {
    const newQ: StepQuizQuestion = {
      id: `q_${Date.now()}`,
      prompt: '',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctIndex: 0
    };
    setQuizQuestions((prev) => [...prev, newQ]);
    setDirty(true);
  };

  const updateQuizQuestion = (idx: number, patch: Partial<StepQuizQuestion>) => {
    setQuizQuestions((prev) => {
      const list = [...prev];
      list[idx] = { ...list[idx], ...patch };
      return list;
    });
    setDirty(true);
  };

  const removeQuizQuestion = (idx: number) => {
    setQuizQuestions((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const save = async () => {
    if (!step) return;
    setSaving(true);
    try {
      await contentService.updateStep(stepId, {
        lessonId: step.lessonId,
        title: title.trim(),
        summary: summary.trim(),
        estimatedMinutes: Number(estimatedMinutes),
        xpReward: Number(xpReward),
        accessLevel,
        checklist: checklist.filter((item) => item.text.trim().length > 0)
      });

      await saveBlocks.mutateAsync(blocks);

      await contentService.saveStepQuizzes(
        stepId,
        quizQuestions.filter((q) => q.prompt.trim().length > 0)
      );

      await queryClient.invalidateQueries({ queryKey: queryKeys.content.step(stepId) });

      setDirty(false);
      enqueueSnackbar('Step saved successfully', { variant: 'success' });
    } catch (e) {
      enqueueSnackbar((e as Error).message || 'Save failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !step) return <Skeleton variant="rounded" height={560} />;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
        <IconButton color="secondary" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft size={18} />
        </IconButton>
        <DocumentText1 size={20} />
        <Typography variant="h3" noWrap sx={{ flexGrow: 1 }}>
          {title || 'Step editor'}
        </Typography>
        <Button variant="contained" disabled={!dirty || saving} onClick={save}>
          {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {/* left: data entry tabs */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
              <Tab label="Content" />
              <Tab label={`Quiz (${quizQuestions.length})`} />
            </Tabs>
          </Box>

          {/* TAB 0: CONTENT */}
          {activeTab === 0 && (
            <Stack spacing={2.5}>
              {/* Step Overview Details */}
              <MainCard title="Step details">
                <Stack spacing={2}>
                  <Stack spacing={1}>
                    <InputLabel>Title *</InputLabel>
                    <OutlinedInput fullWidth value={title} onChange={(e) => touch(setTitle)(e.target.value)} />
                  </Stack>

                  <Stack spacing={1}>
                    <InputLabel>Summary / Overview</InputLabel>
                    <OutlinedInput
                      fullWidth
                      multiline
                      minRows={2}
                      value={summary}
                      onChange={(e) => touch(setSummary)(e.target.value)}
                    />
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <InputLabel>Estimated Mins</InputLabel>
                        <OutlinedInput
                          type="number"
                          fullWidth
                          value={estimatedMinutes}
                          onChange={(e) => touch(setEstimatedMinutes)(Number(e.target.value))}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <InputLabel>XP Reward</InputLabel>
                        <OutlinedInput
                          type="number"
                          fullWidth
                          value={xpReward}
                          onChange={(e) => touch(setXpReward)(Number(e.target.value))}
                        />
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <InputLabel>Access Level</InputLabel>
                        <Select value={accessLevel} onChange={(e) => touch(setAccessLevel)(e.target.value as AccessLevel)}>
                          <MenuItem value="FREE">FREE</MenuItem>
                          <MenuItem value="PREMIUM">PREMIUM</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </MainCard>

              {/* Content Blocks */}
              <MainCard title="Content blocks">
                <BlockEditor blocks={blocks} onChange={touch(setBlocks)} />
              </MainCard>

              {/* Checklist Items */}
              <MainCard
                title="Practical Checklist"
                secondary={
                  <Button size="small" variant="outlined" startIcon={<Add size={16} />} onClick={addChecklistItem}>
                    Add Item
                  </Button>
                }
              >
                {checklist.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                    No checklist items added yet. Click &quot;Add Item&quot; to create practical tasks.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {checklist.map((item, idx) => (
                      <Stack key={item.id || idx} direction="row" spacing={1} alignItems="center">
                        <OutlinedInput
                          fullWidth
                          size="small"
                          placeholder={`Task ${idx + 1}...`}
                          value={item.text}
                          onChange={(e) => updateChecklistItem(idx, e.target.value)}
                        />
                        <IconButton size="small" color="error" onClick={() => removeChecklistItem(idx)}>
                          <Trash size={16} />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </MainCard>
            </Stack>
          )}

          {/* TAB 1: QUIZ */}
          {activeTab === 1 && (
            <MainCard
              title="Quiz Questions"
              secondary={
                <Button size="small" variant="contained" startIcon={<Add size={16} />} onClick={addQuizQuestion}>
                  Add Question
                </Button>
              }
            >
              {quizQuestions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No quiz questions added yet. Click &quot;Add Question&quot; to create a knowledge check test for learners.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {quizQuestions.map((q, qIdx) => (
                    <QuizCard
                      key={q.id || qIdx}
                      question={q}
                      index={qIdx}
                      defaultExpanded={qIdx === quizQuestions.length - 1}
                      onChange={(p) => updateQuizQuestion(qIdx, p)}
                      onDelete={() => removeQuizQuestion(qIdx)}
                    />
                  ))}
                </Stack>
              )}
            </MainCard>
          )}
        </Grid>

        {/* right: live preview */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ position: 'sticky', top: 88 }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>
              Live preview
            </Typography>
            <PhoneFrame>
              <StepPreview
                step={{
                  title,
                  summary,
                  estimatedMinutes,
                  xpReward,
                  accessLevel,
                  checklist,
                  quizQuestions
                }}
                blocks={blocks}
              />
            </PhoneFrame>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
