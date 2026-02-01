import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './redux/store';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/navbar/Navbar';
import SideBar from './components/sidebar/SideBar';
import TaskList from './components/tasks/TaskList';
import Dashboard from './pages/dashboard/Dashboard';
import SingleWorkspace from './pages/singleworkspace/SingleWorkSpace';
import MyTasks from './pages/mytasks/MyTasks';

function App() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // État pour contrôler l'affichage des modals
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Routes qui ne doivent pas afficher la sidebar et navbar
  const noLayoutRoutes = ['/login', '/register', '/admin/login', '/admin/register'];
  const shouldShowLayout = user && !noLayoutRoutes.includes(location.pathname);

  // Handlers pour les boutons du Navbar
  const handleNewProjectClick = () => {
    setShowWorkspaceForm(true);
  };

  const handleNewTicketClick = () => {
    setShowTicketForm(true);
  };

  return (
    <div className="app-container">
      {shouldShowLayout && (
        <Navbar 
          onNewProjectClick={handleNewProjectClick}
          onNewTicketClick={handleNewTicketClick}
        />
      )}
      
      <div className="app-body">
        {shouldShowLayout && <SideBar />}
        
        <div className={`main-content ${shouldShowLayout ? 'with-layout' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/register" element={<Register />} />
            <Route path="/admin/login" element={<Login />} />

            <Route path="/workspaces/:id/tasks" element={<TaskList />} />
            <Route 
              path="/" 
              element={
                <Dashboard 
                  showWorkspaceForm={showWorkspaceForm}
                  onCloseWorkspaceForm={() => setShowWorkspaceForm(false)}
                />
              } 
            />
            <Route 
              path="/workspace/:id" 
              element={
                <SingleWorkspace 
                  showTicketForm={showTicketForm}
                  onCloseTicketForm={() => setShowTicketForm(false)}
                />
              } 
            />
            <Route path="/my-tasks" element={<MyTasks />} />
            
            {/* Routes placeholder pour les autres pages */}
            <Route path="/my-tasks" element={<div className="page-placeholder">My Tasks - Coming Soon</div>} />
            <Route path="/team" element={<div className="page-placeholder">Team Members - Coming Soon</div>} />
            <Route path="/calendar" element={<div className="page-placeholder">Calendar - Coming Soon</div>} />
            <Route path="/settings" element={<div className="page-placeholder">Settings - Coming Soon</div>} />
            
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;