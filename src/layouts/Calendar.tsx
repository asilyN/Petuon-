import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import BG from "../assets/BG.png";
import { useTasks } from "./TaskContext";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, addDays, isSameMonth, isSameDay, isBefore, getYear, getMonth } from "date-fns";

const Calendar: React.FC = () => {
    const { tasks } = useTasks();
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(getMonth(currentMonth)); // Track the selected month
    const [selectedYear, setSelectedYear] = useState(getYear(currentMonth)); // Track the selected year
    const [dropdownVisible, setDropdownVisible] = useState(false); // State to toggle dropdown visibility

    // Define a color for the tasks and the date box (you can adjust this if you want to use a different color per task)
    const defaultColor = "#FFDDC1"; // Color for tasks and date box

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

    // Filter tasks for a given date
    const getTasksForDate = (date: Date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        return tasks.filter(task => task.dueDateTime.startsWith(formattedDate));
    };

    // Handle task click to navigate to ToDoList
    const handleTaskClick = (taskId: string) => {
        navigate(`/todo/${taskId}`);
    };

    // Handle date click to navigate to ToDoList with tasks for that date
    const handleDateClick = (date: Date) => {
        const tasksForDate = getTasksForDate(date);
        if (tasksForDate.length > 0) {
            navigate(`/todo`, { state: { tasks: tasksForDate } });
        } else {
            alert("No tasks for this date!");
        }
    };

    // Handle month and year selection from the dropdown
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(e.target.value, 10);
        setSelectedMonth(newMonth);
        const newDate = new Date(selectedYear, newMonth, 1);
        setCurrentMonth(newDate);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = parseInt(e.target.value, 10);
        setSelectedYear(newYear);
        const newDate = new Date(newYear, selectedMonth, 1);
        setCurrentMonth(newDate);
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Render calendar header with month/year button
    const renderHeader = () => (
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={prevMonth}
                className="text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-all duration-300"
            >
                &lt;
            </button>
            <div className="flex items-center relative">
                <button
                    onClick={toggleDropdown}
                    className="text-xl font-bold mx-4 bg-gray-100 rounded-xl py-2 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                >
                    {format(currentMonth, "MMMM yyyy")}
                </button>

                {dropdownVisible && (
                    <div className="absolute top-12 left-0 bg-white shadow-lg rounded-xl w-52 p-4 max-h-96 overflow-y-auto">
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Select Month</label>
                            <select
                                value={selectedMonth}
                                onChange={handleMonthChange}
                                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Year</label>
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                {Array.from({ length: 41 }, (_, index) => getYear(new Date()) - 20 + index).map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={nextMonth}
                className="text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-all duration-300"
            >
                &gt;
            </button>
        </div>
    );

    // Render days of the week
    const renderDays = () => (
        <div className="grid grid-cols-7 text-center font-bold mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-2">{day}</div>
            ))}
        </div>
    );

    // Render calendar days with tasks
    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart); // Start the calendar view from the beginning of the week
        const endDate = endOfMonth(currentMonth); // Get the last day of the current month

        const dateCells = [];
        let day = startDate;

        while (isBefore(day, endDate) || isSameDay(day, endDate)) {
            const formattedDate = format(day, "d");
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart); // Check if the day belongs to the current month
            const tasksForDate = getTasksForDate(day);

            const isSelected = tasksForDate.length > 0;

            // Apply color to the entire date box if there are tasks for that date
            const dayClasses = `flex flex-col border p-4 h-24 w-full rounded-lg cursor-pointer transition-all duration-300 ${
                isCurrentMonth ? "" : "text-gray-400"
            } ${isToday ? "bg-blue-100 border-blue-400 shadow-lg" : ""} ${
                isSelected ? `bg-[${defaultColor}] border-[${defaultColor}]` : ""
            }`;

            dateCells.push(
                <div
                    key={day.toString()}
                    className={dayClasses}
                    onClick={() => handleDateClick(day)} // Trigger the date click handler
                >
                    <div className="text-right text-lg font-semibold">{formattedDate}</div>
                    <div className="flex-1 overflow-y-auto">
                        {tasksForDate.map((task, index) => {
                            const taskDate = new Date(task.dueDateTime);
                            const isPastDue = isBefore(taskDate, new Date());

                            return (
                                <div
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent date click handler from firing
                                        handleTaskClick(task.id); // Go to task details on task click
                                    }}
                                    className="text-xs mt-1 rounded p-1 cursor-pointer transition-all duration-300"
                                    style={{
                                        backgroundColor: isPastDue ? "#FFC1C1" : defaultColor,
                                        color: isPastDue ? "#990000" : "inherit", // Dark red text for visibility on pastel red
                                    }}
                                >
                                    {task.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
            day = addDays(day, 1); // Move to the next day
        }

        return <div className="grid grid-cols-7 gap-2">{dateCells}</div>;
    };

    return (
        <div
            className="flex gap-2 lg:gap-4 justify-start"
            style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            <Sidebar />

            <div
                className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col"
                style={{
                    backgroundColor: "#F6F6F6",
                    marginLeft: "-10px",
                    overflowY: "auto",  // Allow scrolling within the content area if necessary
                }}
            >
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Calendar</h1>

                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>
        </div>
    );
};

export default Calendar;
