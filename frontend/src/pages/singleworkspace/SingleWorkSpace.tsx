import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaPlus, FaEllipsisH, FaClock } from "react-icons/fa";
import { fetchTasksByWorkspace, Task, updateTask } from "../../redux/taskSlice/taskSlice";
import TicketForm from "../../components/ticketForm/TicketForm";
import TaskDetailModal from "../../components/taskDetailModal/TaskDetailModal";
import "./singleworkspace.scss";

interface SingleWorkspaceProps {
  showTicketForm?: boolean;
  onCloseTicketForm?: () => void;
}

const SingleWorkspace: React.FC<SingleWorkspaceProps> = ({ 
  showTicketForm: externalShowTicketForm = false, 
  onCloseTicketForm 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [internalShowTicketForm, setInternalShowTicketForm] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState("todo");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const tasks = useSelector((state: any) => state.task.tasks);

  // Combiner les deux états (externe et interne) pour showTicketForm
  const showTicketForm = externalShowTicketForm || internalShowTicketForm;

  useEffect(() => {
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  }, [id, dispatch]);

  // Ouvrir le form depuis le Navbar (externe)
  useEffect(() => {
    if (externalShowTicketForm) {
      setInitialTaskStatus("todo");
    }
  }, [externalShowTicketForm]);

  const handleAddTask = (status: string = "todo") => {
    setInitialTaskStatus(status);
    setInternalShowTicketForm(true);
  };

  const handleCloseTicketForm = () => {
    setInternalShowTicketForm(false);
    if (onCloseTicketForm) {
      onCloseTicketForm();
    }
  };

  const handleTaskClick = (task: Task) => {
    if (!draggedTask) {
      setSelectedTask(task);
    }
  };

  const handleCloseDetailModal = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  };

  const handleTaskDeleted = () => {
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
    if (draggedTask && draggedTask.status !== newStatus) {
      dispatch(
        updateTask({
          id: draggedTask.id,
          data: { status: newStatus },
        })
      );
    }
    setDraggedTask(null);
  };

  const columns = [
    { 
      id: "todo", 
      title: "To Do", 
      status: "todo",
      color: "#94a3b8",
      bgColor: "#f8fafc"
    },
    { 
      id: "in_progress", 
      title: "In Progress", 
      status: "in_progress",
      color: "#0ea5e9",
      bgColor: "#eff6ff"
    },
    { 
      id: "done", 
      title: "Done", 
      status: "done",
      color: "#10b981",
      bgColor: "#f0fdf4"
    },
  ];

  return (
    <div className="workspace-layout">
      <header className="workspace-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate("/")}>
            <FaArrowLeft />
          </button>
          <div className="header-info">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Workspace</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">Projects</span>
            </div>
            <h1>Project Dashboard</h1>
            <p>Manage your ongoing initiatives and check tasks status.</p>
          </div>
        </div>
      </header>

      <div className="kanban-board">
        {columns.map((col) => {
          const colTasks = tasks.filter(
            (task: any) => task.status === col.status
          );
          
          return (
            <div 
              key={col.id} 
              className="kanban-column"
              style={{ 
                backgroundColor: col.bgColor,
                borderLeft: `3px solid ${col.color}`
              }}
            >
              <div className="column-header">
                <div className="header-title">
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: col.color }}
                  />
                  <h3>{col.title}</h3>
                  <span className="task-count" style={{ color: col.color }}>
                    {colTasks.length}
                  </span>
                </div>
                <button className="column-menu">
                  <FaEllipsisH />
                </button>
              </div>

              <button
                className="add-task-btn"
                onClick={() => handleAddTask(col.status)}
              >
                <FaPlus /> Add Task
              </button>

              <div
                className="tasks-container"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.status)}
              >
                {colTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="task-card"
                    onClick={() => handleTaskClick(task)}
                    draggable={true}
                    onDragStart={() => handleDragStart(task)}
                  >
                    <div className="task-header">
                      <span className="task-badge" style={{ 
                        backgroundColor: `${col.color}15`,
                        color: col.color 
                      }}>
                        {task.category || col.title}
                      </span>
                    </div>
                    <h4 className="task-title">{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className="task-footer">
                      <div className="task-meta">
                        <img
                          src="https://i.pravatar.cc/100?u=1"
                          alt="assignee"
                          className="task-avatar"
                        />
                        <span className="task-date">
                          <FaClock />
                          {task.created_at 
                            ? new Date(task.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'Today'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showTicketForm && (
        <TicketForm
          onClose={handleCloseTicketForm}
          workspaceId={id!}
          initialStatus={initialTaskStatus}
        />
      )}

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