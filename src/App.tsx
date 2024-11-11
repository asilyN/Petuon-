// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './layouts/Dashboard';
import Calendar from './layouts/Calendar';
import FlashCard from './layouts/FlashCard';
import ToDoList from './layouts/ToDoList';
import Notes from './layouts/Notes';
import { TaskProvider } from './layouts/TaskContext';  // Importing TaskProvider for global task management

const App: React.FC = () => {
  return (
    <TaskProvider>  {/* Wrap the application in TaskProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/flashcard" element={<FlashCard />} />
          <Route path="/todo" element={<ToDoList />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
};

export default App;
