import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import TaskList from './components/tasks/TaskList';
import Dashboard from './pages/Dashboard';



// import Header from './components/layout/Header';
// import Sidebar from './components/layout/Sidebar';

function App() {
  

 return (
    <div className="app-shell">
      <div className="main-area">
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/register" element={<Register />} />
       
            <Route path="/workspaces/:id/tasks" element={<TaskList /> }/>
            <Route path="/" element={<Dashboard/>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
