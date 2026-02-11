// App.tsx
import React, { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "./redux/store";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/navbar/Navbar";
import SideBar from "./components/sidebar/SideBar";
import TaskList from "./components/tasks/TaskList";
import Dashboard from "./pages/dashboard/Dashboard";
import SingleWorkspace from "./pages/singleworkspace/SingleWorkSpace";
import MyTasks from "./pages/mytasks/MyTasks";

function App() {
  // On s'assure que state.auth existe avant de déstructurer user
  const { user } = useAppSelector((state) => state.auth || { user: null });
  const location = useLocation();

  // État pour contrôler l'affichage des modals
  const [showWorkspaceForm, setShowWorkspaceForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);

  // Routes qui ne doivent pas afficher la sidebar et navbar
  const noLayoutRoutes = [
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
  ];
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

        <div
          className={`main-content ${shouldShowLayout ? "with-layout" : ""}`}>
          <Routes>
            {/* Routes Publiques : accessibles seulement si NON connecté */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />

            {/* Routes Protégées : redirigent vers /login si user est null */}
            <Route
              path="/"
              element={
                user ? (
                  <Dashboard
                    showWorkspaceForm={showWorkspaceForm}
                    onCloseWorkspaceForm={() => setShowWorkspaceForm(false)}
                  />
                ) : (
                  <Navigate to="/login" />
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
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/my-tasks"
              element={user ? <MyTasks /> : <Navigate to="/login" />}
            />

            <Route
              path="/workspaces/:id/tasks"
              element={user ? <TaskList /> : <Navigate to="/login" />}
            />

            {/* Redirection automatique pour toute autre URL */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
