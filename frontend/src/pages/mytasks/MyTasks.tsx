import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaCheckCircle, FaCircle, FaExclamationCircle, FaSearch, FaExpand, FaCompress } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchOwnTasks } from "../../redux/taskSlice/taskSlice";
import "./mytasks.scss";

// Types pour les filtres
type FilterType = "all" | "today" | "week" | "overdue";
type StatusFilter = "all" | "todo" | "in_progress" | "done";
type PriorityFilter = "all" | "high" | "medium" | "low";
type ViewDensity = "compact" | "comfortable";

const MyTasks: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.auth.user.user);
  
  // États pour les filtres
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [viewDensity, setViewDensity] = useState<ViewDensity>("compact"); // Nouveau

  const myTasks = useAppSelector((state: any) => state.task.tasks || []);
  const isLoading = useAppSelector((state: any) => state.task.isLoading);

  useEffect(() => {
    dispatch(fetchOwnTasks());
  }, [dispatch]);

  // Fonction pour obtenir la date actuelle
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Fonction pour vérifier si une tâche est aujourd'hui
  const isToday = (date: string) => {
    const taskDate = new Date(date);
    const today = getToday();
    return taskDate.toDateString() === today.toDateString();
  };

  // Fonction pour vérifier si une tâche est cette semaine
  const isThisWeek = (date: string) => {
    const taskDate = new Date(date);
    const today = getToday();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return taskDate >= today && taskDate <= weekFromNow;
  };

  // Fonction pour vérifier si une tâche est en retard
  const isOverdue = (date: string, status: string) => {
    if (status === "done") return false;
    const taskDate = new Date(date);
    const today = getToday();
    return taskDate < today;
  };

  // Filtrer les tâches
  const getFilteredTasks = () => {
    let filtered = myTasks;

    if (activeFilter === "today") {
      filtered = filtered.filter((task: any) => task.due_date && isToday(task.due_date));
    } else if (activeFilter === "week") {
      filtered = filtered.filter((task: any) => task.due_date && isThisWeek(task.due_date));
    } else if (activeFilter === "overdue") {
      filtered = filtered.filter((task: any) => 
        task.due_date && isOverdue(task.due_date, task.status)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task: any) => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task: any) => task.priority === priorityFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((task: any) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  // Statistiques
  const stats = {
    total: myTasks.length,
    completed: myTasks.filter((t: any) => t.status === "done").length,
    inProgress: myTasks.filter((t: any) => t.status === "in_progress").length,
    overdue: myTasks.filter((t: any) => 
      t.due_date && isOverdue(t.due_date, t.status)
    ).length,
  };

  // Fonction pour obtenir l'icône et la couleur du statut
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "todo":
        return { color: "#94a3b8", icon: "⚪", label: "To Do" };
      case "in_progress":
        return { color: "#0ea5e9", icon: "🔵", label: "In Progress" };
      case "done":
        return { color: "#10b981", icon: "✅", label: "Done" };
      default:
        return { color: "#94a3b8", icon: "⚪", label: "Unknown" };
    }
  };

  // Fonction pour obtenir l'icône et la couleur de la priorité
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "high":
        return { color: "#ef4444", icon: "🔴", label: "High" };
      case "medium":
        return { color: "#f59e0b", icon: "🟡", label: "Med" };
      case "low":
        return { color: "#10b981", icon: "🟢", label: "Low" };
      default:
        return { color: "#94a3b8", icon: "⚪", label: "None" };
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = getToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
    });
  };

  // Fonction pour naviguer vers le workspace de la tâche
  const handleTaskClick = (task: any) => {
    navigate(`/workspace/${task.workspace_id}`);
  };

  return (
    <div className="mytasks-container">
      {/* Header */}
      <header className="mytasks-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Acme Workspace</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">My Tasks</span>
          </div>
          <div className="header-title">
            <h1>My Tasks</h1>
            <p>All tasks assigned to you across all workspaces</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon total">
              <FaCircle />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress">
              <FaClock />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon overdue">
              <FaExclamationCircle />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.overdue}</span>
              <span className="stat-label">Overdue</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Tasks
          </button>
          <button
            className={`filter-tab ${activeFilter === "today" ? "active" : ""}`}
            onClick={() => setActiveFilter("today")}
          >
            Today
          </button>
          <button
            className={`filter-tab ${activeFilter === "week" ? "active" : ""}`}
            onClick={() => setActiveFilter("week")}
          >
            This Week
          </button>
          <button
            className={`filter-tab ${activeFilter === "overdue" ? "active" : ""}`}
            onClick={() => setActiveFilter("overdue")}
          >
            Overdue
          </button>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Toggle de densité */}
          <div className="density-toggle">
            <button
              className={`density-btn ${viewDensity === "compact" ? "active" : ""}`}
              onClick={() => setViewDensity("compact")}
              title="Compact view"
            >
              <FaCompress />
            </button>
            <button
              className={`density-btn ${viewDensity === "comfortable" ? "active" : ""}`}
              onClick={() => setViewDensity("comfortable")}
              title="Comfortable view"
            >
              <FaExpand />
            </button>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="tasks-content">
        {isLoading ? (
          <div className="loading-state">Loading your tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaCheckCircle />
            </div>
            <h3>No tasks found</h3>
            <p>
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters"
                : "You're all caught up! 🎉"}
            </p>
          </div>
        ) : (
          <div className={`tasks-list ${viewDensity}`}>
            {filteredTasks.map((task: any) => {
              const statusInfo = getStatusInfo(task.status);
              const priorityInfo = getPriorityInfo(task.priority);
              
              return (
                <div
                  key={task.id}
                  className="task-item"
                  onClick={() => handleTaskClick(task)}
                >
                  {/* Barre de statut à gauche */}
                  <div
                    className="task-status-indicator"
                    style={{ backgroundColor: statusInfo.color }}
                  />

                  {/* Contenu principal */}
                  <div className="task-main">
                    <h4 className="task-title">{task.title}</h4>
                    
                    {/* Description (visible uniquement en mode comfortable) */}
                    {viewDensity === "comfortable" && task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    
                    {/* Métadonnées inline */}
                    <div className="task-meta-inline">
                      <span className="meta-item workspace">
                        📁 {task.workspace_name || "Workspace"}
                      </span>
                      
                      {task.priority && (
                        <span className="meta-item priority" style={{ color: priorityInfo.color }}>
                          {priorityInfo.icon} {priorityInfo.label}
                        </span>
                      )}
                      
                      <span className="meta-item status" style={{ color: statusInfo.color }}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                      
                      {task.due_date && (
                        <span
                          className={`meta-item date ${
                            isOverdue(task.due_date, task.status) ? "overdue" : ""
                          }`}
                        >
                          <FaClock /> {formatDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;