import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaPlus, FaEllipsisH, FaClock } from "react-icons/fa";
import { fetchTasksByWorkspace, Task } from "../../redux/taskSlice/taskSlice";
import TicketForm from "../../components/ticketForm/TicketForm";
import TaskDetailModal from "../../components/taskDetailModal/TaskDetailModal";
import "./singleworkspace.scss";

const SingleWorkspace: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState('todo');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const tasks = useSelector((state: any) => state.task.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  }, [id, dispatch]);

  const handleAddTask = (status: string = 'todo') => {
    setInitialTaskStatus(status);
    setShowTicketForm(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetailModal = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    // Refresh tasks after update
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  };

  const handleTaskDeleted = () => {
    // Refresh tasks after deletion
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  };

  const columns = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in_progress", title: "In Progress", status: "in_progress" },
    { id: "done", title: "Done", status: "done" }
  ];

  return (
    <div className="single-ws-layout">
      <header className="ws-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft />
          </button>
          <div>
            <h1>Development Team</h1>
            <p>Workspace ID: {id}</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="avatars">
            <img src="https://i.pravatar.cc/100?u=4" alt="user" />
            <button className="add-member"><FaPlus /></button>
          </div>
          <button className="btn-primary" onClick={() => handleAddTask('todo')}>
            <FaPlus /> New Task
          </button>
        </div>
      </header>

      <div className="kanban-board">
        {columns.map((col) => {
          const colTasks = tasks.filter((task: any) => task.status === col.status);
          return (
            <div key={col.id} className="kanban-column">
              <div className="column-header">
                <h3>{col.title} <span className="count">{colTasks.length}</span></h3>
                <FaEllipsisH />
              </div>
              <div className="task-list">
                {colTasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className="task-card"
                    onClick={() => handleTaskClick(task)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className="date">
                        <FaClock /> {new Date(task.created_at).toLocaleDateString()}
                      </span>
                      <img src="https://i.pravatar.cc/100?u=1" alt="assignee" />
                    </div>
                  </div>
                ))}
                <button 
                  className="add-task-inline" 
                  onClick={() => handleAddTask(col.status)}
                >
                  <FaPlus /> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <TicketForm 
          onClose={() => setShowTicketForm(false)} 
          workspaceId={id!}
          initialStatus={initialTaskStatus}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleCloseDetailModal}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </div>
  );
};

export default SingleWorkspace;