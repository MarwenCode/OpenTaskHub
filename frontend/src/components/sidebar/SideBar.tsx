import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBell, FaCog, FaCalendar, FaUsers } from "react-icons/fa";
import "./sidebar.scss";
import { useAppSelector } from "../../redux/store";

const SideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state: any) => state.auth.user.user);

  const navItems = [
    { path: "/", icon: FaHome, label: "Projects", key: "projects" },
    { path: "/my-tasks", icon: FaBell, label: "My Tasks", key: "tasks" },
    { path: "/calendar", icon: FaCalendar, label: "Calendar", key: "calendar" },
    { path: "/settings", icon: FaCog, label: "Settings", key: "settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/workspace/");
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="logo-text">OpenTaskHub</span>
        </div>
      </div>

      <div className="workspace-selector">
        <div className="workspace-badge">
          <span className="workspace-icon">🚀</span>
        </div>
        <div className="workspace-info">
          <span className="workspace-name">Workspace</span>
          <span className="workspace-plan">Free Plan</span>
        </div>
        <button className="workspace-dropdown">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <img
            src={`https://i.pravatar.cc/100?u=${user?.id || 1}`}
            alt={user?.username || "User"}
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">{user?.username || "User"}</span>
            <span className="user-email">{user?.email || "user@example.com"}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;