import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from '../src/pages/DashboardPage';
import Calendar from '../src/pages/CalendarPage';
import Flashcard from '../src/components/FlashCard';
import ToDoList from '../src/pages/ToDoListPage';
import Notepad from '../src/pages/NotepadPage';
import LoginPage from '../src/pages/LoginPage';
import RegisterPage from '../src/pages/RegisterPage';

const RoutesComponent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (you can implement later with authentication) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/flashcard" element={<Flashcard />} />
        <Route path="/todolist" element={<ToDoList />} />
        <Route path="/notepad" element={<Notepad />} />

        {/* Catch-all Route for invalid paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;