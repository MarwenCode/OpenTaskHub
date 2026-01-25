/**
 * Comment model
 */
export const CommentModel = {
  id: null,           // string (UUID)
  taskId: null,       // string (UUID)
  userId: null,       // string (UUID)
  text: null,         // string
  createdAt: new Date(),
};