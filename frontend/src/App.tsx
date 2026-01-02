import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import WorkspaceList from './features/workspaces/WorkspaceList';
import TaskList from './features/tasks/TaskList';
import { ProtectedRoute } from './components/common/ProtectedRoute';
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
                <Route path="/workspaces" element={<ProtectedRoute><WorkspaceList /></ProtectedRoute>} />
                <Route path="/workspaces/:id/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/workspaces" replace />} />
              </Routes>
            </main>
          </div>
        </div>
  )
}

export default App
