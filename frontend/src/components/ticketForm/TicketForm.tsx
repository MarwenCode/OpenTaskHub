import React from 'react';
import { FaUpload, FaTimes, FaBriefcase, FaUsers, FaPalette } from 'react-icons/fa';
import { fetchTasksByWorkspace, createTask, updateTask, deleteTask, fetchComments, addComment } from '../../redux/taskSlice/taskSlice';
import { useDispatch } from 'react-redux';
import "./ticketform.scss";


interface TicketFormProps {
  // Define any props needed for the TicketForm component
  onClose: () => void;
  workspaceId: string;
  initialStatus?: string;
}

const TicketForm: React.FC<TicketFormProps> = ({ onClose, workspaceId, initialStatus = 'todo' }) => {
  const dispatch = useDispatch<any>();
  const [task, setTask] = React.useState({
    title: '',
    description: '',
    status: initialStatus,
    workspace_id: workspaceId,
    assigned_to: '',
    created_by: '',
    created_at: '',
    updated_at: '',
    due_date: '',
  });



const resetFormData = () => {
  console.log("Resetting form data");
  setTask({   
    title: '',
    description: '',
    status: initialStatus,   
    workspace_id: workspaceId,
    assigned_to: '',
    created_by: '',
    created_at: '',
    updated_at: '',
    due_date: '',
  });
};

const closeModal = () => {
  console.log("Closing modal");
  onClose();
} 


const createFormTicket = async (e: React.FormEvent) => {  
  e.preventDefault();
  // Validation
  if (!task.title || !task.description) {
    console.log("Please fill in all required fields");
    return;
  }

  try {
    // Prepare payload matching the AsyncThunk and Backend expectations
    const taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      workspaceId: workspaceId,
      assignedTo: task.assigned_to || undefined
    };
    const result = await dispatch(createTask(taskData)).unwrap();
    console.log("Task created successfully", result);
    resetFormData(); // Fermer le modal après succès
    closeModal();
  } catch (error) {
    console.error("Failed to create task:", error);
    // Afficher un message d'erreur à l'utilisateur
  } 
  }




  return (
    <div className='ticket-form-overley'>
      <div className='ticket-modal'>  
        <header className='modal-header'>
          <div className='title-section'>
            <h2>Create New Ticket</h2>
          </div>
          <button className='close-btn' onClick={resetFormData}><FaTimes /></button>
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
          <button type="submit">Create Ticket</button>
        </form>
      </div>

    </div>
  )

}


export default TicketForm