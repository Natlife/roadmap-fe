// ==============================|| REST ENDPOINT MAP ||============================== //
// Backend mounts all routes under /api/v1 (see node-backend/src/app.js and the
// legacy webapp, which calls /api/v1/...). Keep VITE_API_BASE_URL as the host
// only (e.g. https://api.hocmeo.io.vn) — the version prefix lives here.

export const API_VERSION = '/api/v1';

export const endpoints = {
  auth: {
    login: `${API_VERSION}/auth/login`,
    register: `${API_VERSION}/auth/register`,
    me: `${API_VERSION}/auth/me`
  },
  users: {
    list: `${API_VERSION}/users`, // GET (admin) ?page&pageSize
    detail: (id: string) => `${API_VERSION}/users/${id}`, // GET / PUT / DELETE
    create: `${API_VERSION}/admin/users` // POST (admin)
  },
  groups: {
    list: `${API_VERSION}/admin/groups`, // GET
    detail: (id: string) => `${API_VERSION}/admin/groups/${id}`, // GET / PUT / DELETE
    create: `${API_VERSION}/admin/groups`, // POST
    member: (groupId: string, userId: string) => `${API_VERSION}/admin/groups/${groupId}/members/${userId}`
  },
  // taxonomy: kind is 'categories' | 'tags' -> /admin/categories, /admin/tags
  taxonomy: {
    base: (kind: 'categories' | 'tags') => `${API_VERSION}/admin/${kind}`,
    detail: (kind: 'categories' | 'tags', id: string) => `${API_VERSION}/admin/${kind}/${id}`
  },
  // content tree: topic -> lesson(blog) -> step -> blocks
  content: {
    topics: `${API_VERSION}/topics`,
    topicDetail: (id: string) => `${API_VERSION}/topics/${id}`,
    stepDetail: (id: string) => `${API_VERSION}/steps/${id}`,
    adminTopics: `${API_VERSION}/admin/topics`,
    adminTopic: (id: string) => `${API_VERSION}/admin/topics/${id}`,
    adminLessons: `${API_VERSION}/admin/lessons`,
    adminLesson: (id: string) => `${API_VERSION}/admin/lessons/${id}`,
    adminSteps: `${API_VERSION}/admin/steps`,
    adminStep: (id: string) => `${API_VERSION}/admin/steps/${id}`,
    adminStepBatchDelete: `${API_VERSION}/admin/steps/batch-delete`,
    adminStepBlocks: (id: string) => `${API_VERSION}/admin/steps/${id}/blocks`,
    adminStepQuizzes: (id: string) => `${API_VERSION}/admin/steps/${id}/quizzes`,
    parseGDriveFolder: `${API_VERSION}/admin/gdrive/parse-folder`,
    parsePdfSlides: `${API_VERSION}/admin/slides/parse-pdf`,
    uploadImages: `${API_VERSION}/admin/upload/images`
  }
} as const;



