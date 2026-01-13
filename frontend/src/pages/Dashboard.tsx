import React, { useState } from 'react';
import { 
  FaHome, FaBell, FaCog, FaUser, FaPlus, 
  FaSearch, FaEllipsisH, FaArrowRight 
} from 'react-icons/fa';
import './dashboard.scss';
import { useSelector, useDispatch } from 'react-redux';

import WorkSpaceForm from '../components/workspaceForm/WorkSpaceForm';

// Mock data pour les cartes
const workspaces = [
  {
    id: 1,
    title: 'Marketing Team',
    description: 'Campaigns management, social media content calendar, and quarterly...',
    projects: 8,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    members: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3']
  },
  {
    id: 2,
    title: 'Engineering',
    description: 'Sprint tracking, bug fixes, and infrastructure maintenance tasks.',
    projects: 12,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    members: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5']
  },
  {
    id: 3,
    title: 'Design System',
    description: 'UI kit components, documentation, and brand asset management.',
    projects: 3,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&q=80',
    members: ['https://i.pravatar.cc/150?u=6']
  },
  {
    id: 4,
    title: 'Finance',
    description: 'Q4 Budget planning and payroll management.',
    projects: 2,
    image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=400&q=80',
    members: ['https://i.pravatar.cc/150?u=7']
  }
];

const Dashboard: React.FC = () => {
const dispatch = useDispatch();
 const user = useSelector((state: any) => state.auth.user);


console.log('User from Redux:', user);



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
          <a href="#" className="nav-item active"><FaHome /> Home</a>
          <a href="#" className="nav-item"><FaBell /> Notifications</a>
          <a href="#" className="nav-item"><FaCog /> Settings</a>
          <a href="#" className="nav-item"><FaUser /> Profile</a>
        </nav>

        <button className="new-project-btn">
          <FaPlus /> New Project
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>Welcome back, {user.username}</h1>
            <p>Here are your active workspaces</p>
          </div>
          <button className="create-workspace-btn">
            Create Workspace <FaPlus />
          </button>
        </header>

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

        <div className="workspaces-grid">
          {workspaces.map((ws) => (
            <div className="workspace-card" key={ws.id}>
              <div className="card-image" style={{ backgroundImage: `url(${ws.image})` }}>
                <span className="project-badge">{ws.projects} Active Projects</span>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3>{ws.title}</h3>
                  <FaEllipsisH className="more-icon" />
                </div>
                <p>{ws.description}</p>
                <div className="card-footer">
                  <div className="members-stack">
                    {ws.members.map((m, i) => (
                      <img key={i} src={m} alt="member" />
                    ))}
                    <span className="plus-members">+4</span>
                  </div>
                  <button className="enter-btn">
                    Enter <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* ADD NEW WORKSPACE SLOT */}
          <div className="workspace-card add-new">
            <div className="add-content">
             
            
              <div className="plus-circle">
                <FaPlus />
              </div>
              <h3>New Workspace</h3>
              <p>Create a new space for your team</p>
            </div>
          </div>
              {/* <>  <WorkSpaceForm /> </> */}
       
        </div>
      </main>
    </div>
  );
};

export default Dashboard;