import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { logout, reset } from "../../redux/authSlice/authSlice";
import "./navbar.scss";

interface NavbarProps {
  onNewProjectClick?: () => void;
  onNewTicketClick?: () => void;
  onSearchChange?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onNewProjectClick,
  onNewTicketClick,
  onSearchChange,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
    setShowDropdown(false);
  };

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || "U";
  };

  // Déterminer quel bouton afficher selon la route
  const getActionButton = () => {
    // Si on est sur la page d'un workspace (kanban board)
    if (location.pathname.startsWith("/workspace/")) {
      return {
        label: "New Ticket",
        onClick: onNewTicketClick,
        show: true,
      };
    }

    // Si on est sur le dashboard principal
    if (location.pathname === "/" && user?.role === "admin") {
      return {
        label: "New Project",
        onClick: onNewProjectClick,
        show: true,
      };
    }

    // Pas de bouton pour les autres pages
    return {
      label: "",
      onClick: undefined,
      show: false,
    };
  };

  const actionButton = getActionButton();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
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
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects, tasks, or tags..."
            className="search-input"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Bouton Export */}
        {/* <button className="btn-secondary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Export
        </button> */}

        {/* Bouton dynamique (New Project ou New Ticket) */}
        {actionButton.show && (
          <button className="btn-primary" onClick={actionButton.onClick}>
            <FaPlus /> {actionButton.label}
          </button>
        )}

        {/* Notifications */}
        <button className="nav-btn has-notification">
          <FaBell />
        </button>

        {/* User Menu */}
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
