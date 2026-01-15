import React, { useState } from 'react';
import { FaSearch, FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { logout, reset } from '../../redux/authSlice/authSlice';
import './navbar.scss';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <div className="logo-icon"></div>
          <span className="logo-text">OpenTaskHub</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks, projects, workspaces..."
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <button className="nav-btn">
          <FaBell />
        </button>

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="user-name">{user?.username || 'User'}</span>
          </button>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-item">
                <FaUser />
                <span>Profile</span>
              </div>
              <div className="dropdown-item">
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
