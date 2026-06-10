export const SHOOT_TYPES = ['portrait', 'wedding', 'id_photo', 'commercial', 'event'] as const;
export const TIME_SLOTS = ['morning', 'afternoon', 'full_day'] as const;
export const ORDER_STATUS = ['pending', 'confirmed', 'shooting', 'completed', 'cancelled'] as const;
export const ERROR_CODES = { UNAUTHORIZED: 'UNAUTHORIZED', API_FAILED: 'API_FAILED', CONFIG_MISSING: 'CONFIG_MISSING' };

export const SHOOT_TYPE_LABELS: Record<string, string> = {
  portrait: '人像写真',
  wedding: '婚纱摄影',
  id_photo: '证件照',
  commercial: '商业拍摄',
  event: '活动跟拍',
};

export const TIME_SLOT_LABELS: Record<string, string> = {
  morning: '上午',
  afternoon: '下午',
  full_day: '全天',
};

export const SCHEDULE_ACTIONS = {
  PUBLISH: 'schedule-publish',
  PUBLISH_FROM_TEMPLATE: 'schedule-publish-template',
  SAVE_TEMPLATE: 'schedule-save-template',
  LIST_TEMPLATES: 'schedule-list-templates',
  DELETE_TEMPLATE: 'schedule-delete-template',
} as const;

export const SCHEDULE_MESSAGES = {
  DUPLICATE_WARNING: '以下日期的时段与已有档期冲突：',
  PUBLISH_SUCCESS: '档期已发布。',
  TEMPLATE_SAVED: '模板已保存。',
  TEMPLATE_DELETED: '模板已删除。',
  TEMPLATE_EMPTY: '暂无保存的档期模板。',
  TEMPLATE_NAME_EXISTS: '同名模板已存在，请更换名称。',
  NO_TEMPLATES: '还没有模板，请先手动填写并保存为模板。',
} as const;
