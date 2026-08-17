export type AccessLevel = 'FREE' | 'PREMIUM' | 'GROUP';

// Ordered, typed content blocks for a step (matches the Flutter renderer).
export type BlockType = 'RICHTEXT' | 'HEADING' | 'CALLOUT' | 'QUOTE' | 'CODE' | 'IMAGE' | 'BULLETS';

export interface StepBlock {
  /** local uid for editing (not persisted) */
  uid: string;
  id?: string;
  type: BlockType;
  title?: string;
  /** HTML for rich types; raw code for CODE */
  body?: string;
  items?: string[]; // BULLETS
  mediaUrl?: string; // IMAGE
  caption?: string; // IMAGE
  codeLanguage?: string; // CODE
  orderIndex?: number;
}

export interface StepChecklistItem {
  id: string;
  text: string;
}

export interface StepQuizQuestion {
  id?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface Step {
  id: string;
  lessonId: string;
  title: string;
  summary: string;
  orderIndex: number;
  accessLevel: AccessLevel;
  estimatedMinutes?: number;
  xpReward?: number;
  passThreshold?: number;
  status: number;
  checklist?: StepChecklistItem[];
  quizQuestions?: StepQuizQuestion[];
  contentBlocks: StepBlock[];
}

// The middle layer — shown as "Blog" in the UI, stored as a lesson.
export interface Blog {
  id: string;
  code?: string;
  topicId: string;
  title: string;
  summary: string;
  orderIndex: number;
  accessLevel: AccessLevel;
  allowedGroupIds?: string[];
  estimatedMinutes?: number;
  status: number;
  steps: Step[];
  totalStepsCount?: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  levelLabel: string;
  estimatedHours: number;
  accessLevel: AccessLevel;
  allowedGroupIds?: string[];
  status: number;
  categoryIds: string[];
  tagIds: string[];
  lessons: Blog[];
}

export interface CreateTopicPayload {
  title: string;
  description?: string;
  emoji?: string;
  levelLabel?: string;
  estimatedHours?: number;
  accessLevel?: AccessLevel;
  allowedGroupIds?: string[];
  categoryIds?: string[];
  tagIds?: string[];
}
export interface CreateBlogPayload {
  topicId: string;
  title: string;
  summary?: string;
  accessLevel?: AccessLevel;
  allowedGroupIds?: string[];
  estimatedMinutes?: number;
  orderIndex?: number;
}
export interface CreateStepPayload {
  lessonId: string;
  title: string;
  summary?: string;
  accessLevel?: AccessLevel;
  estimatedMinutes?: number;
  xpReward?: number;
  orderIndex?: number;
  checklist?: StepChecklistItem[];
  quizQuestions?: StepQuizQuestion[];
}

export const BLOCK_LABEL: Record<BlockType, string> = {
  RICHTEXT: 'Rich text',
  HEADING: 'Heading',
  CALLOUT: 'Callout',
  QUOTE: 'Quote',
  CODE: 'Code',
  IMAGE: 'Image',
  BULLETS: 'Bullet list'
};
