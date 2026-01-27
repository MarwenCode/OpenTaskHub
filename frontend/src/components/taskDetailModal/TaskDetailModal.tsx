// components/taskDetailModal/TaskDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { FaTimes, FaUser, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, addComment, updateTask, deleteTask, Task } from '../../redux/taskSlice/taskSlice';
import './taskdetailmodal.scss';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, 
  onClose, 
  onTaskUpdated,
  onTaskDeleted 
}) => {
  const dispatch = useDispatch<any>();
  const comments = useSelector((state: any) => state.task.comments);
  const currentUser = useSelector((state: any) => state.auth.user);
  
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    assigned_to: task.assigned_to || ''
  });
  const [users, setUsers] = useState<any[]>([]);

  // Fetch comments when modal opens
  useEffect(() => {
    if (task.id) {
      dispatch(fetchComments(task.id));
    }
  }, [task.id, dispatch]);

  // Fetch users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token') || currentUser?.token;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'todo':
        return 'status-todo';
      case 'in_progress':
        return 'status-in-progress';
      case 'done':
        return 'status-done';
      default:
        return '';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  // Handle add comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      await dispatch(addComment({ 
        taskId: task.id, 
        text: commentText 
      })).unwrap();
      
      setCommentText('');
      console.log('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment');
    }
  };

  // Handle update task
  const handleUpdateTask = async () => {
    try {
      await dispatch(updateTask({
        id: task.id,
        data: {
          title: editedTask.title,
          description: editedTask.description,
          status: editedTask.status,
          assignedTo: editedTask.assigned_to || null
        }
      })).unwrap();

      console.log('Task updated successfully');
      setIsEditing(false);
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task');
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask(task.id)).unwrap();
      console.log('Task deleted successfully');
      if (onTaskDeleted) onTaskDeleted();
      onClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  // Find assigned user
  const assignedUser = users.find(u => u.id === task.assigned_to);

  return (
    <div className="task-detail-overlay" onClick={onClose}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="modal-header">
          <div className="header-content">
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="edit-title-input"
              />
            ) : (
              <h2>{task.title}</h2>
            )}
            <span className={`status-badge ${getStatusClass(task.status)}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          <div className="header-actions">
            {!isEditing && (
              <>
                <button 
                  className="icon-btn edit-btn" 
                  onClick={() => setIsEditing(true)}
                  title="Edit task"
                >
                  <FaEdit />
                </button>
                <button 
                  className="icon-btn delete-btn" 
                  onClick={handleDeleteTask}
                  title="Delete task"
                >
                  <FaTrash />
                </button>
              </>
            )}
            <button className="icon-btn close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="modal-body">
          {/* Task Details Section */}
          <section className="task-details-section">
            <h3>Details</h3>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    rows={4}
                    placeholder="Task description..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editedTask.status}
                      onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as any })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Assign to</label>
                    <select
                      value={editedTask.assigned_to}
                      onChange={(e) => setEditedTask({ ...editedTask, assigned_to: e.target.value })}
                    >
                      <option value="">-- Unassigned --</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="edit-actions">
                  <button 
                    className="btn-cancel" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditedTask({
                        title: task.title,
                        description: task.description || '',
                        status: task.status,
                        assigned_to: task.assigned_to || ''
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleUpdateTask}>
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="detail-item">
                  <label>Description</label>
                  <p>{task.description || 'No description provided'}</p>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <label><FaUser /> Assigned to</label>
                    <p>{assignedUser ? `${assignedUser.username} (${assignedUser.email})` : 'Unassigned'}</p>
                  </div>

                  <div className="detail-item">
                    <label><FaClock /> Created</label>
                    <p>{formatDate(task.created_at)}</p>
                  </div>
                </div>

                {task.updated_at && task.updated_at !== task.created_at && (
                  <div className="detail-item">
                    <label><FaClock /> Last Updated</label>
                    <p>{formatDate(task.updated_at)}</p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Comments Section */}
          <section className="comments-section">
            <h3>Comments ({comments.length})</h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="add-comment-form">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
              />
              <button type="submit" className="btn-add-comment">
                Add Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author">
                        <FaUser className="user-icon" />
                        <span className="username">{comment.username || 'Unknown User'}</span>
                      </div>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;