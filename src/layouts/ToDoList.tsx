import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, WalletCards, CalendarRange, NotebookPen, ListTodo, Trash2 } from 'lucide-react';
import logo from '../assets/logo.png';
import { Button } from '../components/Button';
import BG from '../assets/BG.png';
import { useTasks } from './TaskContext';

const ToDoList: React.FC = () => {
    const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();
    const [taskInput, setTaskInput] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [sortOption, setSortOption] = useState<string>('default'); // State for sorting

    const handleAddTask = (event: React.FormEvent) => {
        event.preventDefault();
        if (!taskInput || !dueDate || !dueTime) {
            alert('Please fill in all fields');
            return;
        }

        const newTask = { name: taskInput, dueDateTime: `${dueDate} ${dueTime}`, completed: false };
        addTask(newTask);
        setTaskInput('');
        setDueDate('');
        setDueTime('');
    };

    // Sorting function
    const sortTasks = (tasks: any[]) => {
        switch (sortOption) {
            case 'oldest':
                return [...tasks].sort(
                    (a, b) => new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime()
                );
            case 'newest':
                return [...tasks].sort(
                    (a, b) => new Date(b.dueDateTime).getTime() - new Date(a.dueDateTime).getTime()
                );
            case 'default':
            default:
                return tasks;
        }
    };

    const sortedTasks = sortTasks(tasks);

    const isTaskExpired = (dueDateTime: string) => {
        return new Date(dueDateTime) < new Date();
    };

    return (
        <div
            className="flex gap-2 lg:gap-4 justify-start"
            style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
            }}
        >
            {/* Sidebar */}
            <div className="flex flex-col items-center gap-[45px] flex-shrink-0 rounded-3xl">
                <Link to="/">
                    <img src={logo} className="h-[130px]" alt="Logo" />
                </Link>
                <Link to="/">
                    <Button variant="ghost" className="h-20 pl-2">
                        <LayoutDashboard size={32} color="white" />
                    </Button>
                </Link>
                <Link to="/flashcard">
                    <Button variant="ghost" className="h-20 pl-2">
                        <WalletCards size={32} color="white" />
                    </Button>
                </Link>
                <Link to="/calendar">
                    <Button variant="ghost" className="h-20 pl-2">
                        <CalendarRange size={32} color="white" />
                    </Button>
                </Link>
                <Link to="/notes">
                    <Button variant="ghost" className="h-20 pl-2">
                        <NotebookPen size={32} color="white" />
                    </Button>
                </Link>
                <Link to="/todo">
                    <Button variant="ghost" className="h-20 pl-2">
                        <ListTodo size={32} color="white" />
                    </Button>
                </Link>
            </div>

            {/* Main Content */}
            <div
                className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col"
                style={{
                    backgroundColor: '#F6F6F6',
                    marginLeft: '-10px',
                }}
            >
                <h1 className="text-2xl font-bold mb-4">To Do List</h1>

                {/* Sort Buttons */}
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={() => setSortOption('default')}
                        className={`px-3 py-1 rounded-full text-sm ${sortOption === 'default' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                    >
                        Default
                    </button>
                    <button
                        onClick={() => setSortOption('oldest')}
                        className={`px-3 py-1 rounded-full text-sm ${sortOption === 'oldest' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                    >
                        Oldest
                    </button>
                    <button
                        onClick={() => setSortOption('newest')}
                        className={`px-3 py-1 rounded-full text-sm ${sortOption === 'newest' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
                    >
                        Newest
                    </button>
                </div>

                {/* Task Form */}
                <form onSubmit={handleAddTask} className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Task"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        className="flex-1 px-4 py-2 rounded bg-white shadow"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="px-4 py-2 rounded bg-white shadow"
                    />
                    <input
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="px-4 py-2 rounded bg-white shadow"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow">
                        Add
                    </button>
                </form>

                {/* Task List */}
                <div className="mt-4 space-y-2">
                    {sortedTasks.length > 0 ? (
                        <ul>
                            {sortedTasks.map((task, index) => (
                                <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg mb-2 shadow">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`task-checkbox-${index}`}
                                            checked={task.completed}
                                            onChange={() => toggleTaskCompletion(index)}
                                            className="peer hidden"
                                        />
                                        <label
                                            htmlFor={`task-checkbox-${index}`}
                                            className={`mr-2 w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-[#719191] border-[#719191]' : 'border-gray-300'} cursor-pointer peer-checked:bg-[#719191] peer-checked:border-[#719191]`}
                                        />
                                        <span className={task.completed ? "line-through text-gray-400" : ""}>
                                            {task.name}
                                        </span>
                                    </div>
                                    <span className={`text-xs ${isTaskExpired(task.dueDateTime) ? 'text-red-500' : 'text-gray-600'}`}>
                                        {task.dueDateTime} {isTaskExpired(task.dueDateTime) && '(Past Due)'}
                                    </span>
                                    <button
                                        onClick={() => deleteTask(index)}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No tasks available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToDoList;
