/* eslint-disable react-hooks/rules-of-hooks */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  addDays,
  isSameDay,
  getMonth,
  getYear,
  addMonths,
  subMonths,
} from 'date-fns';
import { useNavigate } from 'react-router-dom'; // Import for navigation

interface Tasks {
    task_id: string;
    text: string;
    dueAt: Date;
  }
  
  const CalendarComponent: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(getMonth(currentMonth));
    const [selectedYear, setSelectedYear] = useState(getYear(currentMonth));
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [tasks, setTasks] = useState<Tasks[]>([]);
  
    const navigate = useNavigate(); // For navigation to ToDoListPage
  
    // Navigate to the previous or next month
    const prevMonth = () => {
      const newDate = subMonths(currentMonth, 1);
      setCurrentMonth(newDate);
      setSelectedMonth(getMonth(newDate));
      setSelectedYear(getYear(newDate));
    };
  
    const nextMonth = () => {
      const newDate = addMonths(currentMonth, 1);
      setCurrentMonth(newDate);
      setSelectedMonth(getMonth(newDate));
      setSelectedYear(getYear(newDate));
    };
  
    const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible);
    };
  
    const handleMonthChange = (month: number) => {
      const newDate = new Date(selectedYear, month, 1);
      setCurrentMonth(newDate);
      setSelectedMonth(month);
      setDropdownVisible(false);
    };
  
    const handleYearChange = (year: number) => {
      const newDate = new Date(year, selectedMonth, 1);
      setCurrentMonth(newDate);
      setSelectedYear(year);
      setDropdownVisible(false);
    };
  
    const renderHeader = () => (
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevMonth}
          className="mt-[-7rem] flex items-center justify-center hover:bg-[#52796f] text-[#354F52] rounded-full p-2 transition-all duration-300 ml-[29rem]"
        >
          <ChevronLeft size={24} />
        </button>
  
        <div
          className="mt-[-7rem] relative font-serif font-bold text-[#354F52] text-4xl cursor-pointer transform transition-transform duration-200 hover:scale-105 "
          onClick={toggleDropdown}
        >
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          {dropdownVisible && (
            <div className="absolute bg-white bg-opacity-100 shadow-lg p-4 rounded-md mt-1 z-10 w-[800px] left-1/2 transform -translate-x-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="text-lg"
                  >
                    Select Month
                  </h3>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ].map((month, index) => (
                      <button
                        key={index}
                        onClick={() => handleMonthChange(index)}
                        style={{ fontFamily: '"Signika Negative", sans-serif' }}
                        className="p-2 text-sm hover:bg-[#354F52] hover:text-white transition-colors rounded-md"
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="text-lg font-semibold"
                  >
                    Select Year
                  </h3>
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {[...Array(21)].map((_, idx) => {
                      const year = selectedYear + idx - 10; // Showing 10 years before and 10 years after current year
                      return (
                        <button
                          key={year}
                          onClick={() => handleYearChange(year)}
                          style={{ fontFamily: '"Signika Negative", sans-serif' }}
                          className="block p-2 text-sm hover:bg-[#354F52] hover:text-white w-full text-left transition-colors rounded-md"
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="mt-[-7rem] flex items-center justify-center hover:bg-[#52796f] text-[#354F52] rounded-full p-2 transition-all duration-300 mr-[29rem]"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  
    const renderDaysOfWeek = () => (
      <div className="text-[#354F52] grid grid-cols-7 font-serif text-center font-semibold text-lg mb-2 mt-[-1.4rem]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-1">
            {day}
          </div>
        ))}
      </div>
    );
  
    useEffect(() => {
      const fetchTasks = async () => {
        const response = await axios.get('http://localhost:3002/tasks/getTask');
        const taskData = response.data.map(
          (task: { task_id: string; text: string; due_at: Date }) => {
            const dueAt = new Date(task.due_at);
            return {
              task_id: task.task_id,
              text: task.text,
              dueAt: dueAt,
            };
          }
        );
        setTasks(taskData);
      };
      fetchTasks();
    }, []);
  
    const renderCells = () => {
      const [expandedDay, setExpandedDay] = useState<string | null>(null); // Track which day is expanded
    
      const toggleExpand = (date: string) => {
        setExpandedDay(expandedDay === date ? null : date); // Toggle dropdown visibility
      };
    
      const monthStart = startOfMonth(currentMonth);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfMonth(currentMonth);
    
      const dateCells = [];
      let day = startDate;
    
      while (day <= endDate) {
        const formattedDate = format(day, 'd'); // e.g., "29"
        const formattedFullDate = format(day, 'yyyy-MM-dd'); // e.g., "2024-11-29"
        const isToday = isSameDay(day, new Date()); // Highlight if today
        const isCurrentMonth = getMonth(day) === selectedMonth; // Check if in the current month
    
        // Filter tasks for this specific day
        const tasksForDay = tasks.filter(
          task => format(new Date(task.dueAt), 'yyyy-MM-dd') === formattedFullDate
        );
    
        // Styling for day cells
        const dayClasses = `flex flex-col border p-2 h-20 w-full rounded-lg cursor-pointer  hover:shadow-lg transition-shadow transition-all duration-300 ${
          isCurrentMonth ? '' : 'text-gray-400'
        } ${isToday ? 'bg-[#FE9B72] text-white' : ''}`; // Highlight for today
    
        dateCells.push(
          <div
            key={day.toString()}
            className={dayClasses}
            onClick={() => toggleExpand(formattedFullDate)} // Toggle dropdown on click
          >
            {/* Render day number */}
            <div className="text-right text-sm font-semibold">{formattedDate}</div>
    
            {/* Conditionally show tasks in the container */}
            {tasksForDay.length > 0 && (
              <div>
                {expandedDay !== formattedFullDate &&
                  tasksForDay.slice(0, 1).map(task => (
                      <div
                      key={task.task_id}
                      style={{ fontFamily: '"Signika Negative", sans-serif' }}
                      className={`ml-[0.5rem] text-lg truncate ${
                        new Date(task.dueAt) < new Date() ? 'text-red-600 glow-red' : 'text-blue-600'
                      }`}
                      >
                      {task.text}
                      </div>
                  ))}
                {tasksForDay.length > 1 && (
                    <div className=' left-[11.2rem] top-[13.4rem] text-gray-600'>
                        +{tasksForDay.length - 1} more task{tasksForDay.length - 2 > 1 ? 's' : ''}
                    </div>
                )}

                {expandedDay === formattedFullDate && (
                  <div className="absolute mt-2 bg-white border shadow-lg rounded-md p-2 z-10 max-h-20 w-[10rem] overflow-y-auto [&::-webkit-scrollbar]:w-2">
                    {tasksForDay.map(task => (
                      <div
                        key={task.task_id}
                        onClick={() => navigate(`/ToDoList?taskId=${task.task_id}`)}
                        className="text-md text-black truncate cursor-pointer hover:bg-gray-200 p-1 rounded"
                        style={{ fontFamily: '"Signika Negative", serif' }}
                        
                      >
                        {task.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
    
        day = addDays(day, 1);
      }
    
      return <div className="grid grid-cols-7 gap-3">{dateCells}</div>;
    };
    
    return (
        <div>
        <h1
          style={{ fontFamily: '"Crimson Pro", serif' }}
          className="text-[3rem] text-[#354F52] ftracking-normal mb-4 mt-7"
        >
          Calendar
        </h1>
        <div
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="p-3  max-w-[1340px] mx-auto"
        >
          {renderHeader()}
          {renderDaysOfWeek()}
          {renderCells()}
        </div>
      </div>
    )
}
export default CalendarComponent