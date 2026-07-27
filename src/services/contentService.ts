import axios, { unwrap } from '@/api/axios';
import { endpoints } from '@/api/endpoints';
import type {
  ApiEnvelope,
  Blog,
  BlockType,
  CreateBlogPayload,
  CreateStepPayload,
  CreateTopicPayload,
  Step,
  StepBlock,
  Topic
} from '@/types';

let uidSeq = 0;
const uid = () => `b_${Date.now()}_${uidSeq++}`;

function normalizeBlock(raw: Record<string, unknown>): StepBlock {
  return {
    uid: uid(),
    id: raw.id != null ? String(raw.id) : undefined,
    type: String(raw.type ?? 'RICHTEXT').toUpperCase() as BlockType,
    title: (raw.title as string) ?? '',
    body: (raw.body as string) ?? '',
    items: Array.isArray(raw.items) ? (raw.items as string[]) : [],
    mediaUrl: (raw.mediaUrl as string) ?? '',
    caption: (raw.caption as string) ?? '',
    codeLanguage: (raw.codeLanguage as string) ?? '',
    orderIndex: Number(raw.orderIndex ?? 0)
  };
}

function normalizeStep(raw: Record<string, unknown>): Step {
  const rawQuiz = (raw.quiz as Record<string, unknown>) || {};
  const rawQuizQuestions =
    (rawQuiz.questions as Record<string, unknown>[]) ||
    (raw.quizQuestions as Record<string, unknown>[]) ||
    (raw.quiz_questions as Record<string, unknown>[]) ||
    [];

  return {
    id: String(raw.id),
    lessonId: String(raw.lessonId ?? raw.lesson_id ?? ''),
    title: (raw.title as string) ?? '',
    summary: (raw.summary as string) ?? '',
    orderIndex: Number(raw.orderIndex ?? 0),
    accessLevel: String(raw.accessLevel ?? 'FREE').toUpperCase() as Step['accessLevel'],
    estimatedMinutes: Number(raw.estimatedMinutes ?? raw.estimated_minutes ?? 10),
    xpReward: Number(raw.xpReward ?? raw.xp_reward ?? 20),
    passThreshold: Number(rawQuiz.passThreshold ?? raw.passThreshold ?? 70),
    status: Number(raw.status ?? 1),
    checklist: Array.isArray(raw.checklist)
      ? (raw.checklist as Record<string, unknown>[]).map((item, idx) => ({
          id: String(item.id || `c_${idx}`),
          text: String(item.text || item || '')
        }))
      : [],
    quizQuestions: rawQuizQuestions.map((q, idx) => ({
      id: String(q.id || `q_${idx}`),
      prompt: String(q.prompt || ''),
      options: Array.isArray(q.options) ? (q.options as string[]).map(String) : [],
      correctIndex: Number(q.correctIndex ?? q.correct_index ?? 0)
    })),
    contentBlocks: Array.isArray(raw.contentBlocks) ? (raw.contentBlocks as Record<string, unknown>[]).map(normalizeBlock) : []
  };
}

function normalizeBlog(raw: Record<string, unknown>): Blog {
  return {
    id: String(raw.id),
    topicId: String(raw.topicId ?? raw.topic_id ?? ''),
    title: (raw.title as string) ?? '',
    summary: (raw.summary as string) ?? '',
    orderIndex: Number(raw.orderIndex ?? 0),
    accessLevel: String(raw.accessLevel ?? 'FREE').toUpperCase() as Blog['accessLevel'],
    estimatedMinutes: Number(raw.estimatedMinutes ?? 0),
    status: Number(raw.status ?? 1),
    steps: Array.isArray(raw.steps) ? (raw.steps as Record<string, unknown>[]).map(normalizeStep) : [],
    totalStepsCount: Number(raw.totalStepsCount ?? (Array.isArray(raw.steps) ? raw.steps.length : 0))
  };
}

function normalizeTopic(raw: Record<string, unknown>): Topic {
  return {
    id: String(raw.id),
    title: (raw.title as string) ?? '',
    description: (raw.description as string) ?? '',
    emoji: (raw.emoji as string) ?? 'book',
    levelLabel: (raw.levelLabel as string) ?? 'Beginner',
    estimatedHours: Number(raw.estimatedHours ?? 0),
    accessLevel: String(raw.accessLevel ?? 'FREE').toUpperCase() as Topic['accessLevel'],
    status: Number(raw.status ?? 1),
    categoryIds: (raw.categoryIds as string[]) ?? [],
    tagIds: (raw.tagIds as string[]) ?? [],
    lessons: Array.isArray(raw.lessons) ? (raw.lessons as Record<string, unknown>[]).map(normalizeBlog) : []
  };
}

// blocks sent to PUT /admin/steps/:id/blocks (backend re-orders + sanitizes)
function toWireBlock(b: StepBlock, index: number) {
  return {
    type: b.type,
    title: b.title ?? '',
    body: b.body ?? '',
    items: b.items ?? [],
    mediaUrl: b.mediaUrl ?? '',
    caption: b.caption ?? '',
    codeLanguage: b.codeLanguage ?? '',
    orderIndex: index
  };
}

const contentService = {
  async listTopics(): Promise<Topic[]> {
    const res = await axios.get<ApiEnvelope<Record<string, unknown>[]>>(endpoints.content.topics);
    return (unwrap(res) ?? []).map(normalizeTopic);
  },
  async getTopic(id: string): Promise<Topic> {
    const res = await axios.get<ApiEnvelope<Record<string, unknown>>>(endpoints.content.topicDetail(id));
    return normalizeTopic(unwrap(res));
  },
  async getStep(id: string): Promise<Step> {
    const res = await axios.get<ApiEnvelope<Record<string, unknown>>>(endpoints.content.stepDetail(id));
    return normalizeStep(unwrap(res));
  },
  async saveStepBlocks(stepId: string, blocks: StepBlock[]): Promise<void> {
    await axios.put(endpoints.content.adminStepBlocks(stepId), blocks.map(toWireBlock));
  },
  async saveStepQuizzes(stepId: string, quizzes: StepQuizQuestion[]): Promise<void> {
    await axios.put(endpoints.content.adminStepQuizzes(stepId), quizzes);
  },

  // --- topic CRUD ---
  createTopic: (payload: CreateTopicPayload) => axios.post(endpoints.content.adminTopics, payload).then(unwrap),
  updateTopic: (id: string, payload: Partial<CreateTopicPayload>) => axios.put(endpoints.content.adminTopic(id), { id, ...payload }).then(unwrap),
  deleteTopic: (id: string) => axios.delete(endpoints.content.adminTopic(id)).then(() => undefined),

  // --- blog (lesson) CRUD ---
  createBlog: (payload: CreateBlogPayload) => axios.post(endpoints.content.adminLessons, payload).then(unwrap),
  updateBlog: (id: string, payload: Partial<CreateBlogPayload>) => axios.put(endpoints.content.adminLesson(id), { id, ...payload }).then(unwrap),
  deleteBlog: (id: string) => axios.delete(endpoints.content.adminLesson(id)).then(() => undefined),

  // --- step CRUD ---
  createStep: (payload: CreateStepPayload) => axios.post(endpoints.content.adminSteps, payload).then(unwrap),
  updateStep: (id: string, payload: Partial<CreateStepPayload>) => axios.put(endpoints.content.adminStep(id), { id, ...payload }).then(unwrap),
  deleteStep: (id: string) => axios.delete(endpoints.content.adminStep(id)).then(() => undefined),

  makeBlock: (type: BlockType): StepBlock => ({ uid: uid(), type, title: '', body: '', items: [], mediaUrl: '', caption: '', codeLanguage: type === 'CODE' ? 'javascript' : '' })
};

export default contentService;
