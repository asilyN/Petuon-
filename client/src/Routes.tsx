import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Dashboard from '../src/pages/DashboardPage';
import Calendar from '../src/pages/CalendarPage';
import Flashcard from '../src/pages/FlashCardPage';
import ToDoList from '../src/pages/ToDoListPage';
import Notepad from '../src/pages/NotepadPage';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';

import UserRoute from './UserRoute';

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <UserRoute>
              <Calendar />
            </UserRoute>
          }
        />
        <Route
          path="/flashcard"
          element={
            <UserRoute>
              <Flashcard />
            </UserRoute>
          }
        />
        <Route
          path="/todolist"
          element={
            <UserRoute>
              <ToDoList />
            </UserRoute>
          }
        />
        <Route
          path="/notepad"
          element={
            <UserRoute>
              <Notepad />
            </UserRoute>
          }
        />

        {/* Catch-all Route for invalid paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
