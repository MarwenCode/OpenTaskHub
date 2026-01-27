import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createTask } from '../../redux/taskSlice/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import "./ticketform.scss";

interface User {
  id: string;
  username: string;
  email: string;
}

interface TicketFormProps {
  onClose: () => void;
  workspaceId: string;
  initialStatus?: string;
}

const TicketForm: React.FC<TicketFormProps> = ({ 
  onClose, 
  workspaceId, 
  initialStatus = 'todo' 
}) => {
  const dispatch = useDispatch<any>();
  
  // Get token from Redux store (same way your taskSlice does it)
  const token = useSelector((state: any) => state.auth.user?.token);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: initialStatus,
    workspace_id: workspaceId,
    assigned_to: '',
  });

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error('No token found');
        setError('Authentication required');
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching users with token:', token); // Debug log
        
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('Users fetched:', response.data.users); // Debug log
        setUsers(response.data.users || []);
        setError('');
      } catch (error: any) {
        console.error("Failed to fetch users:", error);
        console.error("Error response:", error.response?.data);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [token]);

  const resetFormData = () => {
    setTask({   
      title: '',
      description: '',
      status: initialStatus,   
      workspace_id: workspaceId,
      assigned_to: '',
    });
  };

  const closeModal = () => {
    onClose();
  };

  const createFormTicket = async (e: React.FormEvent) => {  
    e.preventDefault();
    
    if (!task.title || !task.description) {
      console.log("Please fill in all required fields");
      return;
    }

    try {
      const taskData = {
        title: task.title,
        description: task.description,
        status: task.status,
        workspaceId: workspaceId,
        ...(task.assigned_to && { assignedTo: task.assigned_to })
      };
      
      console.log("Submitting task data:", taskData);
      
      const result = await dispatch(createTask(taskData)).unwrap();
      console.log("Task created successfully", result);
      resetFormData();
      closeModal();
    } catch (error) {
      console.error("Failed to create task:", error);
    } 
  };

  return (
    <div className='ticket-form-overley'>
      <div className='ticket-modal'>  
        <header className='modal-header'>
          <div className='title-section'>
            <h2>Create New Ticket</h2>
          </div>
          <button className='close-btn' onClick={closeModal}>
            <FaTimes />
          </button>
        </header>

        <form onSubmit={createFormTicket} className='ticket-form'>
          <label>
            Title:
            <input 
              type="text" 
              value={task.title} 
              onChange={(e) => setTask({ ...task, title: e.target.value })} 
              required 
            />
          </label>
          
          <label>
            Description:
            <textarea 
              value={task.description} 
              onChange={(e) => setTask({ ...task, description: e.target.value })} 
              required 
            />
          </label>
          
          <label>
            Assign to:
            <select
              value={task.assigned_to}
              onChange={(e) => setTask({ ...task, assigned_to: e.target.value })}
              disabled={loading}
            >
              <option value="">
                {loading ? 'Loading users...' : '-- Unassigned --'}
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            {error && <span style={{color: 'red', fontSize: '12px'}}>{error}</span>}
          </label>
          
          <button type="submit">Create Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;