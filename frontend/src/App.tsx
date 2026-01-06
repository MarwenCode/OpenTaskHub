import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkspaceList from './components/workspaces/WorkspaceList';
import TaskList from './components/tasks/TaskList';

// import Header from './components/layout/Header';
// import Sidebar from './components/layout/Sidebar';

function App() {
  

  return (
    <div className="app-shell">
          {/* <Header /> */}
          <div className="main-area">
            {/* <Sidebar /> */}
            <main>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/workspaces" element={<WorkspaceList />} />
                <Route path="/workspaces/:id/tasks" element={<TaskList /> }/>
                <Route path="/" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
  )
}

export default App
