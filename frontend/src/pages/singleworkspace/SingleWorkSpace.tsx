import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaPlus, FaEllipsisH, FaClock } from "react-icons/fa";
import { fetchTasksByWorkspace, createTask } from "../../redux/taskSlice/taskSlice";
import TicketForm from "../../components/ticketForm/TicketForm";
import "./singleworkspace.scss";

const SingleWorkspace: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [showTicketForm, setShowTicketForm] = React.useState(false);
  
  
  // const { tasks } = useSelector((state: any) => state.task);
  const tasks = useSelector((state: any) => state.task.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  }, [id, dispatch]);

  const handleAddTask = (status: string = 'todo') => {
    // Open TicketForm modal to create a new task
  
    setShowTicketForm(true);
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
          <button className="btn-primary" onClick={() => handleAddTask('todo')}><FaPlus /> New Task</button>
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
                  <div key={task.id} className="task-card">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <div className="task-meta">
                      <span className="date"><FaClock /> {new Date(task.created_at).toLocaleDateString()}</span>
                      <img src="https://i.pravatar.cc/100?u=1" alt="assignee" />
                    </div>
                  </div>
                ))}
                <button className="add-task-inline" onClick={() => handleAddTask(col.status)}><FaPlus /> Add Task</button>
              </div>
            </div>
          );
        })}
      </div>
      {showTicketForm && (
        <TicketForm 
          onClose={() => setShowTicketForm(false)} 
          
        />
      )}
    </div>
  );
};

export default SingleWorkspace;