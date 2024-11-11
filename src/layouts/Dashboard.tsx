import React, { useState } from 'react';
import { useTasks } from './TaskContext';
import Sidebar from './Sidebar';  // Import Sidebar component
import { Trash2 } from 'lucide-react';
import BG from '../assets/BG.png';

const Dashboard: React.FC = () => {
    const { tasks, toggleTaskCompletion, deleteTask } = useTasks();
    const [sortOption, setSortOption] = useState<string>('default');

    // Sorting function for tasks
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
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content */}
            <div
                className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col"
                style={{
                    backgroundColor: '#F6F6F6',
                    marginLeft: '-10px',
                }}
            >
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                {/* Container with My Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* My Tasks Container */}
                    <div
                        className="bg-white rounded-2xl shadow-lg p-6"
                        style={{ height: '400px', overflowY: 'auto' }}
                    >
                        <h2 className="text-lg font-semibold">My Tasks</h2>

                        {/* Gray Line Separator */}
                        <div className="border-t border-gray-300 mt-2 mb-4"></div>

                        {/* Sort Buttons */}
                        <div className="mt-4 mb-4 flex gap-2 justify-start items-center">
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

                        {/* Task List */}
                        <div className="mt-4 space-y-2">
                            {sortedTasks.length > 0 ? (
                                <ul>
                                    {sortedTasks.map((task, index) => (
                                        <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg mb-2 shadow">
                                            <div className="flex items-center">
                                                {/* Circular Checkbox */}
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
                                                <span className={task.completed ? " text-gray-400" : ""}>
                                                    {task.name}
                                                </span>
                                            </div>
                                            <span
                                                className={`text-xs ${isTaskExpired(task.dueDateTime) ? 'text-red-500' : 'text-gray-600'}`}
                                            >
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

                    {/* Progress Container */}
                    <div className="bg-white rounded-2xl shadow-lg p-6" style={{ height: '620px' }}>
                        <h2 className="text-lg font-semibold">Pet</h2>
                        {/* Gray Line Separator */}
                        <div className="border-t border-gray-300 mt-2 mb-4"></div>
                        {/* Add additional content here */}
                    </div>
                </div>

                {/* Additional Flex Container */}
                <div className="flex gap-4">
                    <div
                        className="bg-white rounded-2xl shadow-lg p-6"
                        style={{
                            height: '200px',
                            width: '49%',
                            marginTop: '-200px',
                        }}
                    >
                        <h2 className="text-lg font-semibold">Progress</h2>
                        {/* Gray Line Separator */}
                        <div className="border-t border-gray-300 mt-2 mb-4"></div>
                        <div className="mt-4">{/* Add Progress Content Here */}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
