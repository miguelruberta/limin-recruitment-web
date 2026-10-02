export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  SUPERINTENDENT: 'SUPERINTENDENT',
  VIEWER: 'VIEWER',
});

export const WRITE_ROLES = Object.freeze([ROLES.ADMIN, ROLES.SUPERINTENDENT]);
export const ADMIN_ROLES = Object.freeze([ROLES.ADMIN]);

export const DRY_DOCK_STATUS = Object.freeze({
  PLANNING: 'PLANNING',
  EXECUTION: 'EXECUTION',
  COMPLETED: 'COMPLETED',
});

export const DRY_DOCK_STATUS_FLOW = Object.freeze({
  PLANNING: ['EXECUTION'],
  EXECUTION: ['COMPLETED'],
  COMPLETED: [],
});

export const PRIORITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

export const WORK_ORDER_STATUS = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETE: 'COMPLETE',
});

export const PURCHASE_ORDER_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  RECEIVED: 'RECEIVED',
  CANCELLED: 'CANCELLED',
});

export const TASK_STATUS = Object.freeze({
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
});

export const STAY_TYPE = Object.freeze({
  IN_DOCK: 'IN_DOCK',
  REPAIR: 'REPAIR',
});

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

export const ALLOWED_IMAGE_MIME = Object.freeze(['image/jpeg', 'image/png', 'image/webp']);
export const ALLOWED_DOCUMENT_MIME = Object.freeze([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
export const ALLOWED_UPLOAD_MIME = Object.freeze([
  ...ALLOWED_IMAGE_MIME,
  ...ALLOWED_DOCUMENT_MIME,
]);

export const PASSWORD_MIN_LENGTH = 10;
export const REFRESH_TOKEN_BYTES = 64;
export const MAX_LOGIN_FAILURES = 10;