import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaBell,
  FaCog,
  FaUser,
  FaPlus,
  FaSearch,
  FaEllipsisH,
  FaArrowRight,
} from "react-icons/fa";
import "./dashboard.scss";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchWorkspaces } from "../redux/worksapceSlice/workspaceSlice";
import WorkSpaceForm from "../components/workspaceForm/WorkSpaceForm";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1553877522-43269d4ea984";

const Dashboard: React.FC = () => {
  const user = useAppSelector((state: any) => state.auth.user.user);
  const dispatch = useAppDispatch();
  const workspacesState = useAppSelector((state) => state.workspace);
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  console.log("Workspaces state from Redux:", workspacesState);
  console.log("User from Redux:", user);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-box">
            <div className="logo-icon"></div>
          </div>
          <div className="brand-info">
            <span className="brand-name">OpenTaskHub</span>
            <span className="brand-plan">Pro Plan</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <FaHome /> Home
          </a>
          <a href="#" className="nav-item">
            <FaBell /> Notifications
          </a>
          <a href="#" className="nav-item">
            <FaCog /> Settings
          </a>
          <a href="#" className="nav-item">
            <FaUser /> Profile
          </a>
        </nav>

        <button className="new-project-btn">
          <FaPlus /> New Project
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="main-header">
          <div className="header-left">
            <h1>Welcome back, {user?.username}</h1>
            <p>Here are your active workspaces</p>
          </div>
          {user?.role === "admin" && (
            <button
              className="create-workspace-btn"
              onClick={() => setShowWorkspaceForm(true)}>
              Create Workspace <FaPlus />
            </button>
          )}
        </header>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search workspaces..." />
          </div>
          <div className="filter-tabs">
            <button className="tab active">All Workspaces</button>
            <button className="tab">Owned by me</button>
            <button className="tab">Shared with me</button>
          </div>
        </div>

        {/* LOADING STATE */}
        {workspacesState?.isLoading && (
          <div className="loading">
            <p>Loading workspaces...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {workspacesState?.isError && (
          <div className="error">
            <p>Error: {workspacesState.message}</p>
          </div>
        )}

        {/* WORKSPACES GRID */}
        {!workspacesState?.isLoading && !workspacesState?.isError && (
          <div className="workspaces-grid">
            {/* EMPTY STATE */}
            {workspacesState?.workspaces?.length === 0 ? (
              <div className="empty-state">
                <p>No workspaces yet. Create your first one!</p>
              </div>
            ) : (
              <>
                {/* EXISTING WORKSPACES */}
                {workspacesState?.workspaces.map((workspace) => (
                  <div key={workspace.id} className="workspace-card">
                    <div
                      className="card-image"
                      style={{
                        backgroundImage: `url(${workspace.imageUrl || DEFAULT_IMAGE})`,
                      }}>
                      <span className="project-badge">
                        {workspace.category}
                      </span>
                    </div>

                    <div className="card-content">
                      <div className="card-header">
                        <h3>{workspace.name}</h3>
                        <FaEllipsisH className="more-icon" />
                      </div>

                      <p>{workspace.description}</p>

                      <div className="card-footer">
                        <button className="enter-btn">
                          Enter <FaArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ADD NEW WORKSPACE CARD */}
                {user?.role === "admin" && (
                  <div
                    className="workspace-card add-new"
                    onClick={() => setShowWorkspaceForm(true)}>
                    <div className="add-content">
                      <div className="plus-circle">
                        <FaPlus />
                      </div>
                      <h3>New Workspace</h3>
                      <p>Create a new space for your team</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* MODAL DE CRÉATION */}
        {showWorkspaceForm && (
          <WorkSpaceForm onClose={() => setShowWorkspaceForm(false)} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
