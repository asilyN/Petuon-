
//the router for the components
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/DashboardPage';
import Calendar from './pages/CalendarPage';
import Flashcard from './pages/FlashCardPage';
import ToDoList from './pages/ToDoListPage';
import Notepad from './pages/NotepadPage';


const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          {/* Main Routee */}
          <Route path="/" element={<Dashboard />} />

          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Flashcard" element={<Flashcard />} />
          <Route path="/ToDoList" element={<ToDoList />} />
          <Route path="/Notepad" element={<Notepad />} />
        </Routes>
      </Router>
  );
};

export default App;