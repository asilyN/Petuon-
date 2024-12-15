import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Dashboard from '../pages/DashboardPage';
import Calendar from '../pages/CalendarPage';
import Flashcard from '../components/flashcard/FlashCardComponent';
import ToDoList from '../pages/ToDoListPage';
import Notepad from '../pages/NotepadPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

interface RoutersProps {
  isLoggedIn: boolean;
}

const Routers: React.FC<RoutersProps> = ({ isLoggedIn }) => {
  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            {/* Authenticated Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Flashcard" element={<Flashcard />} />
            <Route path="/Notepad" element={<Notepad />} />

            {/* Dynamic Route for ToDoList with taskId */}
            <Route path="/ToDoList" element={<ToDoList />} />
          </>
        ) : (
          <>
            {/* Unauthenticated Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Redirect unauthenticated users to Login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default Routers;
