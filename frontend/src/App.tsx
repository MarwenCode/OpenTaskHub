import React, { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/navbar/Navbar";
import SideBar from "./components/sidebar/SideBar";
import TaskList from "./components/tasks/TaskList";
import MyTasks from "./pages/mytasks/MyTasks";
import Dashboard from "./pages/dashboard/Dashboard";
import Landing from "./pages/landing/Landing";
import SingleWorkspace from "./pages/singleworkspace/SingleWorkSpace";
import { useAppSelector } from "./redux/store";

function App() {
  const { user } = useAppSelector((state) => state.auth || { user: null });
  const location = useLocation();

  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);

  const noLayoutRoutes = ["/", "/login", "/register", "/admin/login", "/admin/register"];
  const shouldShowLayout = Boolean(user) && !noLayoutRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {shouldShowLayout && (
        <Navbar
          onNewProjectClick={() => setShowWorkspaceForm(true)}
          onNewTicketClick={() => setShowTicketForm(true)}
        />
      )}

      <div className="app-body">
        {shouldShowLayout && <SideBar />}

        <div className={`main-content ${shouldShowLayout ? "with-layout" : ""}`}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />

            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/dashboard" />}
            />
            <Route path="/admin/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route
              path="/admin/register"
              element={!user ? <Register /> : <Navigate to="/dashboard" />}
            />

            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard
                    showWorkspaceForm={showWorkspaceForm}
                    onOpenWorkspaceForm={() => setShowWorkspaceForm(true)}
                    onCloseWorkspaceForm={() => setShowWorkspaceForm(false)}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route
              path="/workspace/:id"
              element={
                user ? (
                  <SingleWorkspace
                    showTicketForm={showTicketForm}
                    onCloseTicketForm={() => setShowTicketForm(false)}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            <Route path="/my-tasks" element={user ? <MyTasks /> : <Navigate to="/" />} />
            <Route
              path="/workspaces/:id/tasks"
              element={user ? <TaskList /> : <Navigate to="/" />}
            />

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
