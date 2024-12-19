import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from '../src/pages/DashboardPage';
import Calendar from '../src/pages/CalendarPage';
import Flashcard from '../src/pages/FlashCardPage';
import ToDoList from '../src/pages/ToDoListPage';
import Notepad from '../src/pages/NotepadPage';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';

import UserRouter from "./UserRoute"

const RoutesComponent: React.FC = () => {
  return (
    <Router>
    <Routes>
      {/* Redirect root to login page */}
      <Route path="/" element={<LoginPage />} />

      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <UserRouter>
            <Dashboard />
          </UserRouter>
        }
      />
      <Route
        path="/calendar"
        element={
          <UserRouter>
            <Calendar />
          </UserRouter>
        }
      />
      <Route
        path="/flashcard"
        element={
          <UserRouter>
            <Flashcard />
          </UserRouter>
        }
      />
      <Route
        path="/todolist"
        element={
          <UserRouter>
            <ToDoList />
          </UserRouter>
        }
      />
      <Route
        path="/notepad"
        element={
          <UserRouter>
            <Notepad />
          </UserRouter>
        }
      />

      {/* Catch-all Route for invalid paths */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </Router>
  );
};

export default RoutesComponent;