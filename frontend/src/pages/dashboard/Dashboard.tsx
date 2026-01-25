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
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {fetchWorkspaces} from "../../redux/worksapceSlice/workSpaceSlice";
import { useNavigate } from "react-router-dom";
import WorkSpaceForm from "../../components/workspaceForm/WorkSpaceForm";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1553877522-43269d4ea984";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.auth.user.user);
  const { workspaces, isLoading } = useAppSelector((state) => state.workspace);
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-box"></div>
          <span className="brand-name">OpenTaskHub</span>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active"><FaHome /> Workspaces</button>
          <button className="nav-item"><FaBell /> Activity</button>
          <button className="nav-item"><FaCog /> Settings</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div>
            <h1>Welcome back, {user?.username}</h1>
            <p>Manage your workspaces and team projects</p>
          </div>
          {user?.role === "admin" && (
            <button className="btn-primary" onClick={() => setShowWorkspaceForm(true)}>
              <FaPlus /> Create Workspace
            </button>
          )}
        </header>

        <div className="filter-bar">
          <div className="search-wrapper">
            <FaSearch />
            <input type="text" placeholder="Search workspaces..." />
          </div>
        </div>

        <div className="workspaces-grid">
          {workspaces?.map((ws) => (
            <div key={ws.id} className="workspace-card" onClick={() => navigate(`/workspace/${ws.id}`)}>
              <div className="card-image" style={{ backgroundImage: `url(${ws.imageUrl || DEFAULT_IMAGE})` }}>
                <span className="badge">{ws.category}</span>
              </div>
              <div className="card-body">
                <div className="card-title">
                  <h3>{ws.name}</h3>
                  <FaEllipsisH />
                </div>
                <p>{ws.description}</p>
                <div className="card-footer">
                  <div className="avatars">
                    <img src="https://i.pravatar.cc/100?u=1" alt="user" />
                    <img src="https://i.pravatar.cc/100?u=2" alt="user" />
                    <span>+3</span>
                  </div>
                  <button className="enter-link">Enter <FaArrowRight /></button>
                </div>
              </div>
            </div>
          ))}

          {user?.role === "admin" && (
            <div className="workspace-card add-new" onClick={() => setShowWorkspaceForm(true)}>
              <div className="add-content">
                <div className="plus-icon"><FaPlus /></div>
                <p>Add Workspace</p>
              </div>
            </div>
          )}
        </div>

        {showWorkspaceForm && <WorkSpaceForm onClose={() => setShowWorkspaceForm(false)} />}
      </main>
    </div>
  );
};

export default Dashboard;