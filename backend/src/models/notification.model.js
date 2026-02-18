export const NotificationModel = {
  id: null, // string (UUID)
  userId: null, // string (UUID)
  type: null, // 'task_assigned' | 'task_updated' | 'workspace_invite'
  message: null, // string
  isRead: false, // boolean
  createdAt: new Date(),
  TYPES: ['task_assigned', 'task_updated', 'workspace_invite'],
};
