// Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaPlus,
  FaTasks,
  FaFolder,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logout, reset } from "../../redux/authSlice/authSlice";
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../redux/notificationSlice/notificationSlice";
import "./navbar.scss";

interface NavbarProps {
  onNewProjectClick?: () => void;
  onNewTicketClick?: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'workspace';
  workspaceId?: string;
  description?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  onNewProjectClick,
  onNewTicketClick,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useAppSelector((state) => state.auth.user as any);
  const user = authUser?.user ?? authUser;
  const notifications = useAppSelector((state) => state.notification.notifications);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const isLoading = useAppSelector((state) => state.notification.isLoading);
  const isError = useAppSelector((state) => state.notification.isError);
  const message = useAppSelector((state) => state.notification.message);

  // Get all tasks and workspaces from Redux
  const allTasks = useAppSelector((state) => state.task.tasks);
  const workspaces = useAppSelector((state) => state.workspace.workspaces);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
    setShowDropdown(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search in workspaces
    workspaces?.forEach((workspace: any) => {
      if (workspace.name?.toLowerCase().includes(query)) {
        results.push({
          id: workspace.id,
          title: workspace.name,
          type: 'workspace',
          description: workspace.description,
        });
      }
    });

    // Search in tasks
    allTasks?.forEach((task: any) => {
      const searchText = `${task.title} ${task.description} ${task.category}`.toLowerCase();
      if (searchText.includes(query)) {
        results.push({
          id: task.id,
          title: task.title,
          type: 'task',
          workspaceId: task.workspace_id,
          description: task.description,
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(results.length > 0);
  }, [searchQuery, allTasks, workspaces]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'workspace') {
      navigate(`/workspace/${result.id}`);
    } else if (result.type === 'task') {
      navigate(`/workspace/${result.workspaceId}`);
      // Optionally: You could add logic to open the task detail modal
    }
    
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getUserInitial = () => {
    return user?.username?.trim()?.charAt(0)?.toUpperCase() || "U";
  };

  const getActionButton = () => {
    if (location.pathname.startsWith("/workspace/")) {
      return {
        label: "New Ticket",
        onClick: onNewTicketClick,
        show: true,
      };
    }

    if (location.pathname === "/" && user?.role === "admin") {
      return {
        label: "New Project",
        onClick: onNewProjectClick,
        show: true,
      };
    }

    return {
      label: "",
      onClick: undefined,
      show: false,
    };
  };

  const actionButton = getActionButton();


  useEffect(() =>  {
    dispatch(fetchNotifications());
  }, [dispatch]);

  



  // Notification handlers
  const handleNotificationClick = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
    // Optionally navigate based on notification type
  };
  const handleMarkAllNotificationsAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const toggleNotificationDropdown = () => {
    const nextOpenState = !showNotifDropdown;
    setShowNotifDropdown(nextOpenState);
    if (nextOpenState) {
      dispatch(fetchNotifications());
    }
  };


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
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

      <div className="navbar-center">
        <div className="search-container" ref={searchRef}>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects, tasks, or tags..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          {showSearchResults && (
            <div className="search-results-dropdown">
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-icon">
                    {result.type === 'workspace' ? <FaFolder /> : <FaTasks />}
                  </div>
                  <div className="result-content">
                    <div className="result-title">{result.title}</div>
                    {result.description && (
                      <div className="result-description">
                        {result.description.substring(0, 60)}
                        {result.description.length > 60 ? '...' : ''}
                      </div>
                    )}
                  </div>
                  <div className="result-type">
                    {result.type === 'workspace' ? 'Project' : 'Task'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {actionButton.show && (
          <button className="btn-primary" onClick={actionButton.onClick}>
            <FaPlus /> {actionButton.label}
          </button>
        )}

        <div className="notification-menu" ref={notifRef}>
          <button
            className={`nav-btn ${unreadCount > 0 ? "has-notification" : ""}`}
            onClick={toggleNotificationDropdown}
          >
            <FaBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>

          {showNotifDropdown && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="mark-all-btn"
                    onClick={handleMarkAllNotificationsAsRead}
                  >
                    Mark all
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="notification-state">Loading notifications...</div>
              ) : isError ? (
                <div className="notification-state">{message || "Failed to load notifications"}</div>
              ) : notifications.length === 0 ? (
                <div className="notification-state">No notifications</div>
              ) : (
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className={`notification-item ${notif.is_read ? "" : "unread"}`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <div className="notification-message">{notif.message}</div>
                      <div className="notification-date">
                        {new Date(notif.created_at).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-btn"
            onClick={() => setShowDropdown(!showDropdown)}>
            <div className="user-avatar">{getUserInitial()}</div>
            <span className="user-name">{user?.username || "User"}</span>
            <FaChevronDown />
          </button>

          {showDropdown && (
            <div className="user-dropdown">
              <div
                className="dropdown-item"
                onClick={() => navigate("/profile")}>
                <FaUser />
                <span>Profile</span>
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/settings")}>
                <FaCog />
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
