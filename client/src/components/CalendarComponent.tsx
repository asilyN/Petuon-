/* eslint-disable react-hooks/rules-of-hooks */
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
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
} from "date-fns";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useToDoList } from "../hooks/useToDoList";
import { motion } from 'framer-motion';

const CalendarComponent: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentMonth));
  const [selectedYear, setSelectedYear] = useState(getYear(currentMonth));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {tasks, setTasks, afterloading} = useToDoList();
  const [expandedTaskId, setExpandedTaskId] =  useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  
  const toggleTaskContent = (taskId: string) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };
  
  const navigate = useNavigate();
  const handleClick = (taskId: string) => {
    navigate("/todolist", { state: { highlightedTaskId: taskId } });
  };
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
    <div className="mb-8 sm:mb-4 flex items-center justify-between">
    
  {/* Previous Month Button */}
  <button
    onClick={prevMonth}
    className="flex items-center justify-center rounded-full p-2 text-[#354F52] transition-all -mt-[2rem] ml-duration-300 hover:bg-[#52796f] sm:ml-[15rem] sm:-mt-[7rem] md:ml-[15rem] lg:ml-[14rem] xl:ml-[25rem]"
  >
    <ChevronLeft size={24} />
  </button>

  {/* Month and Year Selector */}
  <div
    className="relative cursor-pointer font-serif text-2xl -mt-[2rem] font-bold text-[#354F52] transition-transform duration-200 hover:scale-105 md:text-3xl lg:text-4xl sm:-mt-[7rem]"
    onClick={toggleDropdown}
  >
    <span>{format(currentMonth, "MMMM yyyy")}</span>
    {dropdownVisible && (
      <div className="absolute left-1/2 z-10 mt-2 w-[120%] max-w-[800px] -translate-x-1/2 transform rounded-md bg-white bg-opacity-100 p-4 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Month Selection */}
          <div>
            <h3
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-lg font-semibold"
            >
              Select Month
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthChange(index)}
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="rounded-md p-2 text-sm transition-colors hover:bg-[#354F52] hover:text-white"
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
          {/* Year Selection */}
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
                    className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-[#354F52] hover:text-white"
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

  {/* Next Month Button */}
  <button
    onClick={nextMonth}
    className="flex items-center justify-center rounded-full p-2 text-[#354F52] -mt-[2rem] transition-all duration-300 hover:bg-[#52796f] sm:mr-[5rem] sm:-mt-[7rem] md:mr-[5rem] lg:mr-[14rem] xl:mr-[25rem]"
  >
    <ChevronRight size={24} />
  </button>
</div>

  );

  const renderDaysOfWeek = () => (
    <div className="mb-2 mt-[-1.4rem] grid grid-cols-7 text-center font-serif text-lg font-semibold text-[#354F52]">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="p-1">
          {day}
        </div>
      ))}
    </div>
  );


  const updateTasks = useCallback(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        return task;
      }),
    );
  }, []);
  
  useEffect(() => {
    const interval = setInterval(updateTasks, 1000);

    return () => clearInterval(interval);
  }, [updateTasks]);

  const listItemVariants = {
    hidden: { opacity: 0 }, // Start fully transparent
    visible: (index: number) => ({
      opacity: 1, // Fade to fully visible
      transition: {
        delay: index * 0.1, // Delay each item by 0.1s
        duration: 0.3,
        ease: 'easeInOut',
      },
    }),
    exit: { opacity: 0 }, // Fade out when exiting
  };
  
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
      const formattedDate = format(day, "d"); // e.g., "29"
      const formattedFullDate = format(day, "yyyy-MM-dd"); // e.g., "2024-11-29"
      const isToday = isSameDay(day, new Date()); // Highlight if today
      const isCurrentMonth = getMonth(day) === selectedMonth; // Check if in the current month

      // Filter tasks for this specific day
      const tasksForDay = tasks.filter(
        (task) =>
          format(new Date(task.dueAt), "yyyy-MM-dd") === formattedFullDate,
      );

      // Styling for day cells
      const dayClasses = `flex flex-col border p-2 h-20 w-full rounded-lg cursor-pointer  hover:shadow-lg transition-shadow transition-all duration-300 
      ${isCurrentMonth ? "" : "text-gray-400"
      } ${isToday ? "text-black border-green-500 bg-[#D1FAE5]" : ""}`

      const emojis = ["☮", "❤︎", "☯"];  
   
      dateCells.push(
        <div
          key={day.toString()}
          className={dayClasses}
          onClick={() => {
            if (tasksForDay.length > 3) {
              toggleExpand(formattedFullDate);
            }
          }}  // Toggle dropdown on click
        >
          <div className="text-right text-sm font-semibold">
          {formattedDate}
          </div>
           {tasksForDay.length > 0 && (
            <div>
              
              {expandedDay !== formattedFullDate &&
                 tasksForDay.slice(0, 3).map((task, index) => (
                  <ul
                    key={task.task_id}
                    className="pl-5 ml-[-2rem] mb-[1.3rem] mt-[-1.2rem] w-[10.5rem]"
                    style={{ listStyleType: "disc" }}
                  >
                    <motion.li
                      initial={afterloading ? "hidden" : undefined}
                      animate={afterloading ? "visible" : undefined}
                      exit={afterloading ? "exit" : undefined}
                      custom={afterloading ? index : undefined}
                      variants={afterloading ? listItemVariants : undefined}
                      style={{
                        fontFamily: '"Signika Negative", sans-serif',
                        color:
                          new Date(task.dueAt) < new Date()
                            ? "red"
                            : isSameDay(new Date(task.dueAt), new Date())
                            ? "green"
                            : new Date(task.dueAt).getDay() === new Date().getDay() + 1
                            ? "orange"
                            : "blue",
                      }}
                      className={`flex flex-col gap-2 ml-[1rem] mt-[-0.6rem] pl-[0.7rem] truncate text-sm hover:scale-110 ${
                        new Date(task.dueAt) < new Date()
                          ? "bg-red-300 mt-[0.1rem] rounded ml-[1rem] pl-2"
                          : isSameDay(new Date(task.dueAt), new Date())
                          ? "bg-green-300 mt-[0.1rem] rounded ml-[1rem] pl-2"
                          : new Date(task.dueAt).getDay() === new Date().getDay() + 1
                          ? "bg-orange-200 mt-[0.1rem] rounded ml-[1rem] pl-2"
                          : "bg-blue-300 mt-[0.1rem] rounded ml-[1rem] pl-2"
                      }`}
                      onClick={() => handleClick(task.task_id)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect(); // Get position of hovered element
                        setModalPosition({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
                        toggleTaskContent(task.task_id);
                      }}
                      onMouseLeave={() => {
                        setExpandedTaskId(null); // Close the modal when the mouse leaves
                      }}
                    >
                      <span>
                        <span className="text-[0.7rem] ml-[-0.3rem] mr-[-0.4rem] pr-[1rem]">
                          {emojis[index % emojis.length]}
                        </span>
                        <span className="text-[0.9rem] ">
                          {task.text.length > 10 ? `${task.text.slice(0, 10)}...` : task.text}
                        </span>
                      </span>
                    </motion.li>
                    {expandedTaskId === task.task_id && (
                      <div
                        className={`modal-content fixed w-[20rem] p-[0.5rem] rounded-lg border border-gray-700 bg-opacity-70 ${
                          new Date(task.dueAt) < new Date()
                            ? "bg-red-200"
                            : isSameDay(new Date(task.dueAt), new Date())
                            ? "bg-green-200"
                            : new Date(task.dueAt).getDay() === new Date().getDay() + 1
                            ? "bg-orange-100"
                            : "bg-blue-100"
                        }`}
                        style={{ top: modalPosition.top, left: modalPosition.left, transform: "translateX(-50%)" }}
                        onClick={() => handleClick}
                      >
                        <span className="ml-[14rem]">
                          {new Date(task.dueAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // Use `false` for 24-hour format
                          })}
                        </span>
                        <div
                          className={`${task.text.length > 10 ? "move-text" : ""} border-t-2 w-[19rem] 
                          ${ new Date(task.dueAt) < new Date()
                            ?  "border-red-300" 
                            : isSameDay(new Date(task.dueAt), new Date())
                            ? "border-green-300"
                            : new Date(task.dueAt).getDay() === new Date().getDay() + 1
                            ? "border-orange-300"
                            : "border-blue-300"
                          }`}
                        >
                          {task.text}
                        </div>
                      
                      </div>
                    )}
                  </ul>
                ))}
                
                {tasksForDay.length > 3 && expandedDay !== formattedFullDate && (
                  <div 
                  className=" text-[#3B82F6] mt-[-2.4rem] ml-[8.7rem] font-medium"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  >
                    + {tasksForDay.length - 3}
                  </div>
                )}
             
              {expandedDay === formattedFullDate && (
                <motion.div className={`absolute z-10  ml-[-0.5rem] max-h-[5.7rem] w-[11.1rem] overflow-x-hidden overflow-y-auto rounded-md border p-2 shadow-lg bg-opacity-0 [&::-webkit-scrollbar]:w-2`}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  {tasksForDay.map((task, index) => (
                    <ul key={task.task_id} className="pl-5 ml-[-2rem] mb-[0.2rem] mt-[-0.1rem] w-[10.4rem] scale-70" style={{ listStyleType: "disc" }}>
                      <li
                      style={{
                        fontFamily: '"Signika Negative", sans-serif',
                        color:
                        new Date(task.dueAt) < new Date() ? 
                        "red" :
                        isSameDay(new Date(task.dueAt), new Date()) ?
                        "green": 
                        new Date(task.dueAt).getDay() === new Date().getDay() + 1 ?
                        "orange" : "blue"
                    }}
                      className={`flex flex-col gap-2 ml-[1rem] mt-[-0.6rem] pl-[0.7rem] truncate text-sm hover:shadow-[0px_4px_10px_rgba(0,0,0,0.5)]  ${
                        new Date(task.dueAt) < new Date() ? 
                        "bg-red-300 mt-[0.1rem] rounded ml-[1rem] pl-2"
                        :  new Date(task.dueAt).getDay() == new Date().getDay() ?
                        "bg-green-300 mt-[0.1rem] rounded ml-[1rem] pl-2"
                        : new Date(task.dueAt).getDay() === new Date().getDay() + 1 ?
                          "bg-orange-200 mt-[0.1rem] rounded ml-[1rem] pl-2" :
                          "bg-blue-300 mt-[0.1rem] rounded ml-[1rem] pl-2"
                    }`}
                      key={task.task_id}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect(); // Get position of hovered element
                        setModalPosition({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
                        toggleTaskContent(task.task_id);
                      }}
                      onMouseLeave={() => {
                        setExpandedTaskId(null); // Close the modal when the mouse leaves
                      }}

                      onClick={() => handleClick(task.task_id)}
                      >
                      <span>
                          <span className="text-[0.7rem] mr-[-0.4rem] pr-[1rem]">
                            {emojis[index % emojis.length]}
                          </span> 
                          <span className="text-[0.9rem] ">
                          {task.text.length > 10 ? `${task.text.slice(0, 10)}...` : task.text}
                          </span>
                        </span> 
                      </li>
                      {expandedTaskId === task.task_id && (
                      <div
                        className={`modal-content fixed w-[20rem] p-[0.5rem] rounded-lg border border-gray-700 bg-opacity-70 ${
                          new Date(task.dueAt) < new Date()
                            ? "bg-red-200"
                            : isSameDay(new Date(task.dueAt), new Date())
                            ? "bg-green-200"
                            : new Date(task.dueAt).getDay() === new Date().getDay() + 1
                            ? "bg-orange-100"
                            : "bg-blue-100"
                        }`}
                        style={{ top: modalPosition.top, left: modalPosition.left, transform: "translateX(-50%)" }}
                        onClick={() => handleClick(task.task_id)}
                      >
                       <div
                          className={`${task.text.length > 10 ? "move-text" : ""} border-t-2 w-[19rem] 
                          ${ new Date(task.dueAt) < new Date()
                            ?  "border-red-300" 
                            :isSameDay(new Date(task.dueAt), new Date())
                            ? "border-green-300"
                            : new Date(task.dueAt).getDay() === new Date().getDay() + 1
                            ? "border-orange-300"
                            : "border-blue-300"
                          }`}
                        >
                          {task.text}
                        </div>
                      </div>
                    )}
                    </ul>
                    
                  ))}
                </motion.div>
                
                )}
            </div>
          )}
        </div>,
      );

      day = addDays(day, 1);
    }

    return <div className="grid grid-cols-7 gap-3">{dateCells}</div>;
  };

  return (
    <div>
      <h1
        style={{ fontFamily: '"Crimson Pro", serif' }}
        className="ftracking-normal mb-4 mt-7 text-[3rem] text-[#354F52]"
      >
        Calendar
      </h1>
      <div
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="mx-auto max-w-[1340px] p-3"
      >
        {renderHeader()}
        {renderDaysOfWeek()}
        {renderCells()}
      </div>
    </div>
  );
};
export default CalendarComponent;
