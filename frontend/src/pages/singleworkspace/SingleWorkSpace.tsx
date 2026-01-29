import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaPlus, FaEllipsisH, FaClock } from "react-icons/fa";
import { fetchTasksByWorkspace, Task, updateTask } from "../../redux/taskSlice/taskSlice";
import TicketForm from "../../components/ticketForm/TicketForm";
import TaskDetailModal from "../../components/taskDetailModal/TaskDetailModal";
import "./singleworkspace.scss";

const SingleWorkspace: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [initialTaskStatus, setInitialTaskStatus] = useState("todo");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const tasks = useSelector((state: any) => state.task.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTasksByWorkspace(id));
    }
  }, [id, dispatch]);

  const handleAddTask = (status: string = "todo") => {
    setInitialTaskStatus(status);
    setShowTicketForm(true);
  };

  const handleTaskClick = (task: Task) => {
    // N'ouvre le modal que si on n'est pas en train de drag
    if (!draggedTask) {
      setSelectedTask(task);
    }
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
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (task: Task) => {
    console.log("🟢 DRAG START:", task.title);
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: string) => {
  console.log("🔴 DROP dans:", newStatus);
  
  if (draggedTask && draggedTask.status !== newStatus) {
    console.log(`✅ Task ${draggedTask.title} moved from ${draggedTask.status} to ${newStatus}`);
    
    // Appel de l'API pour mettre à jour le statut
    dispatch(updateTask({
      id: draggedTask.id,
      data: { status: newStatus }
    }));
  }
  
  setDraggedTask(null);
};

  const columns = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in_progress", title: "In Progress", status: "in_progress" },
    { id: "done", title: "Done", status: "done" },
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
            <button className="add-member">
              <FaPlus />
            </button>
          </div>
          <button className="btn-primary" onClick={() => handleAddTask("todo")}>
            <FaPlus /> New Task
          </button>
        </div>
      </header>

      <div className="kanban-board">
        {columns.map((col) => {
          const colTasks = tasks.filter(
            (task: any) => task.status === col.status,
          );
          return (
            <div key={col.id} className="kanban-column">
              <div className="column-header">
                <h3>
                  {col.title} <span className="count">{colTasks.length}</span>
                </h3>
                <FaEllipsisH />
              </div>
              <div
                className="task-list"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.status)}
                style={{ minHeight: "100px" }}>
                {colTasks.map((task: any) => (
                  <div
                    className="task-list"
                    onDragOver={(e) => {
                      e.preventDefault();
                      console.log("🟡 OVER sur colonne:", col.status);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      console.log(
                        "🔴🔴🔴 DROP DIRECT sur colonne:",
                        col.status,
                      );
                      if (draggedTask) {
                        console.log(
                          "Task:",
                          draggedTask.title,
                          "→",
                          col.status,
                        );
                      }
                      setDraggedTask(null);
                    }}
                    style={{ minHeight: "200px", border: "2px dashed red" }}>
                    {colTasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="task-card"
                        onClick={() => handleTaskClick(task)}
                        draggable={true}
                        onDragStart={() => {
                          console.log("🟢 START:", task.title);
                          setDraggedTask(task);
                        }}
                        style={{ cursor: "grab" }}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <div className="task-meta">
                          <span className="date">
                            <FaClock />{" "}
                            {new Date(task.created_at).toLocaleDateString()}
                          </span>
                          <img
                            src="https://i.pravatar.cc/100?u=1"
                            alt="assignee"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      className="add-task-inline"
                      onClick={() => handleAddTask(col.status)}>
                      <FaPlus /> Add Task
                    </button>
                  </div>
                ))}
                <button
                  className="add-task-inline"
                  onClick={() => handleAddTask(col.status)}>
                  <FaPlus /> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showTicketForm && (
        <TicketForm
          onClose={() => setShowTicketForm(false)}
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
