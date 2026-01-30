import React, { useEffect } from "react";
import { FaEllipsisH, FaArrowRight, FaPlus } from "react-icons/fa";
import "./dashboard.scss";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { fetchWorkspaces } from "../../redux/worksapceSlice/workSpaceSlice";
import { useNavigate } from "react-router-dom";
import WorkSpaceForm from "../../components/workspaceForm/WorkSpaceForm";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1553877522-43269d4ea984";

interface DashboardProps {
  showWorkspaceForm?: boolean;
  onCloseWorkspaceForm?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  showWorkspaceForm = false, 
  onCloseWorkspaceForm 
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.auth.user.user);
  const { workspaces, isLoading } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  const handleCloseForm = () => {
    if (onCloseWorkspaceForm) {
      onCloseWorkspaceForm();
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Acme Workspace</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Projects</span>
          </div>
          <div className="header-title">
            <h1>Project Dashboard</h1>
            <p>Manage your ongoing initiatives and check tasks status.</p>
          </div>
        </div>
      </header>

      <div className="filter-section">
        <div className="filter-buttons">
          <button className="filter-btn active">All Projects</button>
          <button className="filter-btn">Active</button>
          <button className="filter-btn">Archived</button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading workspaces...</div>
      ) : (
        <div className="projects-grid">
          {workspaces?.map((ws) => (
            <div
              key={ws.id}
              className="project-card"
              onClick={() => navigate(`/workspace/${ws.id}`)}
            >
              <div
                className="card-image"
                style={{
                  backgroundImage: `url(${ws.imageUrl || DEFAULT_IMAGE})`,
                }}
              >
                <span className="project-badge">{ws.category || "General"}</span>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{ws.name}</h3>
                  <button className="card-menu" onClick={(e) => e.stopPropagation()}>
                    <FaEllipsisH />
                  </button>
                </div>
                <p className="card-description">{ws.description}</p>
                <div className="card-footer">
                  <div className="members-avatars">
                    <img src="https://i.pravatar.cc/100?u=1" alt="member" />
                    <img src="https://i.pravatar.cc/100?u=2" alt="member" />
                    <img src="https://i.pravatar.cc/100?u=3" alt="member" />
                    <span className="members-count">+3</span>
                  </div>
                  <button className="enter-btn" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/${ws.id}`);
                  }}>
                    Enter <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {user?.role === "admin" && (
            <div
              className="project-card add-card"
              onClick={onCloseWorkspaceForm}
            >
              <div className="add-content">
                <div className="plus-circle">
                  <FaPlus />
                </div>
                <h3>Add Workspace</h3>
                <p>Create a new workspace to organize your projects</p>
              </div>
            </div>
          )}
        </div>
      )}

      {showWorkspaceForm && (
        <WorkSpaceForm onClose={handleCloseForm} />
      )}
    </div>
  );
};

export default Dashboard;