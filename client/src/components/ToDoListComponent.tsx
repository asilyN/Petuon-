/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";

import { Task } from "../types/ToDoListTypes";
import { RotateCcw, SquarePlus, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { useLocation } from "react-router-dom";
// ToDoList Hook
import { useToDoList } from "../hooks/useToDoList";

// Dashboard page (compact) and ToDolist page (default) display
import { ToDoListProps } from "../types/ToDoListTypes";
import React from "react";

const ToDoListComponent: React.FC<ToDoListProps> = ({
  variant = "default",
}) => {
  const [date, setDate] = useState<string>("mm/dd/yyyy");  // Creates Date
  const [time, setTime] = useState<string>("--:-- --");  // Creates Time
  const [task, setTask] = useState<string>("");   // Creates Task

  const [displayTime, setdisplayTime] = useState<string>("");

  const [editIndex, setEditIndex] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editDate, setEditDate] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);

  const lastTaskRef = useRef<HTMLLIElement | null>(null);
  
  const [isAnimatingDropDown, setIsAnimatingDropDown] =
    useState<boolean>(false); //para sa dropdown animation
  const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"];

  const [taskMessage, setTaskMessage] = useState<string>(
    "No active tasks available.",
  );
  const [taskPos, setTaskPos] = useState<string>("left-[42rem]");

  const navigate = useNavigate();
  const location = useLocation();
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(
    location.state?.highlightedTaskId || null
  );

  useEffect(() => {
    if (highlightedTaskId) {
      const timer = setTimeout(() => {
        setHighlightedTaskId(null); // Remove the highlight after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount or update
    }
  }, [highlightedTaskId]);

  const {
    afterloading, setAfterLoading,
    filterType, setFilterType,
    filterArr, setFilterArr,
    tasks, setTasks,
    tasksBackup,
    loading,
    addTask,
    afterMark,
    deleteTask,
    saveEditedTask,
    completedTasks,
    taskInputDisable,
    toggleCompleteTask,
  } = useToDoList();

  // Automatically updates task
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

  // Scrolling to the last task everytime a new task is added
  useEffect(() => {
    if (isAnimatingDropDown && lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [tasks, isAnimatingDropDown]);

  function taskDateTime() {
    // returns a new Date with the set condition
    if (date === "mm/dd/yyyy" && time === "--:-- --") {
      // if date and time are empty
      return new Date(0); // date is set to 0
    } else {
      const taskDate =
        date === "mm/dd/yyyy" ? new Date().toLocaleDateString() : date; // if the value of date is not change with time it will set to today
      const taskTime = time === "--:-- --" ? "23:59" : time; // if the value of time is not change with date it will set to the last minute of today
      return new Date(taskDate + " " + taskTime + ":00");
    }
  }

  function editTaskDateTime() {
    if (editDate === "mm/dd/yyyy" && editTime === "--:-- --") {
      return new Date(0);
    } else {
      const taskDate =
        editDate === "mm/dd/yyyy" ? new Date().toLocaleDateString() : editDate;
      const taskTime = editTime === "--:-- --" ? "23:59" : editTime;
      return new Date(taskDate + " " + taskTime + ":00");
    }
  }

  // Inorder to submit task
  const handleAddTask = async (e: FormEvent) => {
    filteredTasks("default");
    e.preventDefault();
    const newTask = {
      task_id: uuidv4(), // random generated id
      text: task, // the description of the task
      createdAt: new Date(), // stores the Date from when it is created
      dueAt: taskDateTime(), // from the function taskDateTime that stores the set Date
      completed: false, // the status of the task if completed or not
    };

    cancelEditing();
    setIsEditing(false);

    if (
      taskDateTime() < new Date() &&
      !(time === "--:-- --" && date == "mm/dd/yyyy")
    ) {
      alert("Cannot set time in current or past");
      return;
    }

    setIsAnimatingDropDown(true);
    setTimeout(() => {
      setIsAnimatingDropDown(false);
    }, 10); // dropdown duration

    if (lastTaskRef.current) {
      lastTaskRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    setTask(""); // resets the value of the Task
    setDate("mm/dd/yyyy"); // resets the value of the Date
    setTime("--:-- --"); // resets the value of the Time

    await addTask(newTask);
  };
  
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value); // stores the value of the time set
    const displaytime = new Date(
      new Date().toLocaleDateString() + " " + e.target.value + ":00",
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    setdisplayTime(displaytime);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value); // stores the description of the task
  };

  const completeToggle = async (task_id: string) => {
    await toggleCompleteTask(task_id);
  };

  const handleDeleteTask = async (task_id: string) => {
    try {
      setIsEditing(false);
      cancelEditing();
      await deleteTask(task_id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  function filteredTasks(filterType: string) {
    const now = new Date();
    let TasksMessage = taskMessage;
    let FilteredTasks = tasksBackup;
    switch (filterType) {
      case "noDate":
        FilteredTasks = tasksBackup.filter(
          (task) => task.dueAt.getTime() === 0 && !task.completed,
        );
        TasksMessage = "No tasks with no due date available.";
        setTaskPos("left-[38.5rem]");
        break;
      case "near":
        FilteredTasks = tasksBackup
          .filter(
            (task) => task.dueAt.getTime() > now.getTime() && !task.completed,
          )
          .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
        TasksMessage = "No near tasks available.";
        setTaskPos("left-[42rem]");
        break;
      case "later":
        FilteredTasks = tasksBackup
          .filter(
            (task) => task.dueAt.getTime() > now.getTime() && !task.completed,
          )
          .sort((a, b) => b.dueAt.getTime() - a.dueAt.getTime());
        setTaskPos("left-[41rem]");
        TasksMessage = "No tasks available for later.";
        break;
      case "default":
        FilteredTasks = tasksBackup;
        TasksMessage = "No active tasks available.";
        setTaskPos("left-[42rem]");
        break;
      case "pastDue":
        FilteredTasks = tasksBackup.filter(
          (task) =>
            task.dueAt.getTime() !== 0 &&
            task.dueAt.getTime() < now.getTime() &&
            !task.completed,
        );
        TasksMessage = "No tasks past due.";
        setTaskPos("left-[44rem]");
        break;
      case "completed":
        setAfterLoading(false);
        TasksMessage = "No tasks completed.";
        setTaskPos("left-[43.5rem]");
        break;
      default:
        FilteredTasks = tasksBackup;
        TasksMessage = "No active tasks available.";
        setTaskPos("left-[42rem]");
        break;
    }

    setTaskMessage(TasksMessage);
    setFilterType(filterType);
    setFilterArr(FilteredTasks);
    setIsEditing(false);
    cancelEditing();
  }

  const startEditing = (index: string, text: string, date_time: Date) => {
    setEditIndex(index);
    setEditText(text);
    setIsEditing(true);
    if (
      date_time.toTimeString().slice(0, 5) === "08:00" &&
      date_time.toISOString().split("T")[0] === "1970-01-01"
    ) {
      setEditTime("--:-- --");
    } else {
      setEditTime(date_time.toTimeString().slice(0, 5));
    }
    if (date_time.toISOString().split("T")[0] === "1970-01-01") {
      setEditDate("mm/dd/yyyy");
    } else {
      setEditDate(date_time.toISOString().split("T")[0]);
    }
  };

  const handleTextEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  function cancelEditing() {
    setEditIndex(null);
    setEditText("");
  }

  async function saveEditing(task_id: string) {
    setIsEditing(false);
    cancelEditing();

    if (
      editTaskDateTime() < new Date() &&
      !(editTime === "--:-- --" && editDate == "mm/dd/yyyy")
    ) {
      alert("The due date and time cannot be in the past.");
      return;
    }

    await saveEditedTask(task_id, editText, editTaskDateTime());
  }

  const handleTimeEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditTime(e.target.value);
  };

  const handleDateEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditDate(e.target.value);
  };

  const displayStatus = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    const formattedDate = date.toLocaleDateString();
    const todayString = today.toLocaleDateString();
    const tomorrowString = tomorrow.toLocaleDateString();
  
    switch (formattedDate) {
      case "1/1/1970":

        return "NoDue";
      case todayString:

        return "Today";
      case tomorrowString:

        return "Tomorrow";
      default:
      
        return "Upcoming";
    }

  };
  
  const display =
    filterType === "pastDue" ||
    filterType === "near" ||
    filterType === "later" ||
    filterType === "noDate"
      ? filterArr
      : filterType === "completed"
        ? completedTasks
        : tasks;
  const taskVariants = {
    hidden: { opacity: 0, y: 0 }, // Initial state: invisible and above
    visible: { opacity: 1, y: 0 }, // Final state: visible and at the correct position
  };
  const staggerTime = 1; // Total duration for all tasks to be rendered (in seconds)
  const delayPerItem = staggerTime / display.length; // Time delay per task

  const filterTasks = tasks.filter(task => 
    task.dueAt.getTime() > new Date().getTime() ||
    task.dueAt.getTime() === new Date(0).getTime()
  )


  function getDateLabelWithTime(date: Date): string {
    const taskDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true, // For AM/PM format
    };
    

    if (taskDate.getTime() === 0) {
      return "No Due"
    } else if (taskDate.getTime() < new Date().getTime()){
      return "Past Due"
     
    }

    return taskDate.toLocaleString('en-US', options);
  }

  function getDayOfWeek(date: Date): string {
    const taskDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // "long" gives full day names like "Monday"
    };
  
    if (taskDate.getTime() === 0){
      return ""
    } 
    return taskDate.toLocaleDateString('en-US', options);
    
  }

  const groupTasksByDate = (tasks: Task[]): Record<string, Task[]> => {
    return tasks.reduce((acc: Record<string, Task[]>, task: Task) => {
      const dateKey = getDateLabelWithTime(task.dueAt); // Format the date as needed
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {});
  };
  
  const groupedTasks = groupTasksByDate(display);

  const sortedGroupedTasks = Object.entries(groupedTasks).sort(([a], [b]) => {
    if (a === "No Due") return 1;
    if (b === "No Due") return -1;
  
    if (a === "Past Due") return -1;
    if (b === "Past Due") return 1;
  
    const dateA = new Date(a);
    const dateB = new Date(b);
  
    const isValidDateA = !isNaN(dateA.getTime());
    const isValidDateB = !isNaN(dateB.getTime());
  
    if (filterType === "later" && isValidDateA && isValidDateB) {
      return dateB.getTime() - dateA.getTime(); // Sort by descending order for "near"
    }
    
    if (isValidDateA && isValidDateB) {
      return dateA.getTime() - dateB.getTime(); // Default ascending order
    }
  
    if (isValidDateA) return -1;
    if (isValidDateB) return 1;
  
    return a.localeCompare(b);
  });
  
  if (variant === "default") {
    return (
      <>
        <div
          className={`my-3 mb-0 ml-1 mt-[-4rem] flex space-x-2 font-serif font-bold text-[#354F52]`}
        >
          <div>
            <button
              className={`rounded-md px-4 py-2 ${filterType === "default" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110"}`}
              onClick={() => filteredTasks("default")}
            >
              Default
            </button>

            <button
              className={`rounded-md px-4 py-2 ${filterType === "noDate" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
              onClick={() => filteredTasks("noDate")}
            >
              NoDue
            </button>

            <button
              className={`rounded-md px-4 py-2 ${filterType === "near" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
              onClick={() => filteredTasks("near")}
            >
              Near
            </button>

            <button
              className={`rounded-md px-4 py-2 ${filterType === "later" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
              onClick={() => filteredTasks("later")}
            >
              Later
            </button>

            <button
              className={`rounded-md px-4 py-2 ${filterType === "pastDue" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
              onClick={() => filteredTasks("pastDue")}
            >
              PastDue
            </button>

            <button
              className={`rounded-md px-4 py-2 ${filterType === "completed" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
              onClick={() => filteredTasks("completed")}
            >
              Completed
            </button>
            <form
              onSubmit={handleAddTask}
              className="fixed left-[10rem] top-[10rem] w-[84rem] rounded-lg bg-white pb-3 pt-3 text-black shadow-md"
            >
              <button
                type="submit"
                className="ml-5 mt-2 transform text-2xl text-black transition-transform duration-300 hover:scale-110 active:scale-50"
              >
                <SquarePlus size={25} color="#354f52" />
              </button>

              <input
                className="ml-2 w-[46rem] translate-y-[-5px] transform overflow-hidden text-ellipsis bg-transparent text-lg text-black outline-none"
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                type="text "
                placeholder="Enter a task"
                value={task}
                onChange={handleTextChange}
                required
              />

              <label
                className={`absolute right-[21rem] top-[1.4rem] text-[1rem] outline-none ${time === "--:-- --" ? "pointer-events-none select-none text-transparent" : ""}`}
              >
                {displayTime}
              </label>

              <input
                className="absolute right-[18.9rem] top-[1.4rem] w-[1.8rem] scale-125 transform bg-transparent text-[0.9rem] text-white outline-none transition-transform duration-200 hover:scale-150 active:scale-110"
                type="time"
                value={time}
                onChange={handleTimeChange}
              />

              <button
                type="button"
                onClick={() => setTime("--:-- --")}
                className="duration-400 absolute right-[17rem] top-[1.5rem] transform text-2xl transition-transform hover:scale-125 active:rotate-[-360deg]"
              >
                <RotateCcw size={20} color="black" />
              </button>

              <label
                className={`absolute right-[9rem] top-[1.4rem] text-[1rem] outline-none ${date === "mm/dd/yyyy" ? "pointer-events-none select-none text-transparent" : ""}`}
              >
                {date.split("-").reverse().join("-")}
              </label>

              <input
                className="absolute right-[6.8rem] top-[1.2rem] w-[1.55rem] transform bg-transparent text-[1.2rem] outline-none transition-transform duration-200 hover:scale-125 active:scale-90"
                type="date"
                value={date}
                onChange={handleDateChange}
              />

              <button
                type="button"
                onClick={() => setDate("mm/dd/yyyy")}
                className="duration-400 absolute right-[5rem] top-[1.5rem] transform text-2xl transition-transform hover:scale-125 active:rotate-[-360deg]"
              >
                <RotateCcw size={20} color="black" />
              </button>
            </form>
          </div>

          <div
            className={`my-3 mb-0 ml-8 mt-[-15px] flex space-x-2 font-normal`}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
          >
            {loading ? (
              <h1 className="mt-[10.5rem] text-center text-2xl text-gray-500">
                Fetching tasks...
              </h1>
            ) : display.length === 0 ? (
              <>
                <img
                  src="src\assets\sleeping_penguin2.gif"
                  alt="No tasks available"
                  className="mx-auto mt-[12rem] h-[10rem] w-[10rem]"
                />
                <h1
                  className={`fixed mt-[21rem] text-center text-2xl text-gray-500 ${taskPos}`}
                >
                  {taskMessage}
                </h1>
              </>
            ) : null}

            <div
              className={`fixed left-[10rem] top-[14rem] h-[28rem] w-[84.4rem] overflow-auto rounded-lg [&::-webkit-scrollbar]:w-2 overflow-x-hidden`}
            >
            {sortedGroupedTasks.map(([dateKey, tasks]) => (
            <React.Fragment key={dateKey}>
            <h1 className={`ml-[0.2rem] mt-[0.5rem] text-xl ${dateKey === "Past Due" ? "text-red-800": dateKey === getDateLabelWithTime(new Date()) ? "text-green-800" : "" } font-semibold`}>{dateKey}</h1>
            
            <h2 className={`${new Date(tasks[0].dueAt).getTime() === 0? 
              "mt-[0.3rem]" : "mt-[-0.5rem]"} ml-[0.2rem] pb-[0.3rem] opacity-80 
              ${dateKey === "Past Due" ? "text-red-700": dateKey === getDateLabelWithTime(new Date()) ? 
              "text-green-700" : "" }`}>
                {getDayOfWeek(tasks[0].dueAt)}
            </h2>
            {tasks.map((task, index) => (   
                  <>
                  <motion.li
                    key={task.task_id}
                    id={task.task_id}
                    variants={afterloading ? taskVariants : undefined}
                    initial={afterloading 
                      ? "hidden" 
                      : {y:0}
                    }
                    animate={afterloading
                      ? "visible"
                      : undefined
                    }
                    exit={afterloading 
                      ? "visible" 
                      : undefined
                    }
                    transition={
                      afterloading
                        ? { duration: 0.2, delay: index * delayPerItem }
                        : undefined
                    }
                    className={` mt-[-0.4rem] group flex whitespace-nowrap rounded-lg pb-4 pt-4 shadow-md transition-transform duration-1000 hover:shadow-lg 
                      ${isAnimatingDropDown ? "translate-y-[-65px] transform opacity-100" : ""}`}
                    style={{
                      backgroundColor: task.task_id === highlightedTaskId ? "rgba(144, 238, 144, 0.9)" :colors[index % colors.length],  
                      boxShadow: task.task_id === highlightedTaskId ? "0 0 10px 2px 0.8" : "none", 
                      border: task.task_id === highlightedTaskId ?  "1px solid rgba(144, 238, 144, 1)" : "none", 
                      transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      zIndex: task.task_id === highlightedTaskId ? 1000 : "auto",
                      animation: task.task_id === highlightedTaskId ? "beat 1s infinite ease-in-out" : "none",
                    }} 
                    ref={index === tasks.length - 1 ? lastTaskRef :  lastTaskRef}

                    whileHover={{
                      y: -6, // Move up by 0.4rem
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Add shadow
                    }}
                  >
                    
                    <input
                      className="s peer absolute left-[1rem] mt-0 h-5 w-5 translate-y-[0.1rem] transform cursor-pointer appearance-none rounded-full bg-white transition-transform duration-300 checked:bg-[#719191] hover:scale-110 active:scale-50"
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => completeToggle(task.task_id!)}
                      disabled={taskInputDisable === task.task_id && afterMark}
                    />

                    {editIndex === task.task_id ? (
                      <div className="">
                        <input
                          className="absolute left-[3rem] w-[46rem] overflow-hidden text-ellipsis bg-transparent opacity-45 outline-none"
                          type="text"
                          value={editText}
                          onChange={handleTextEditChange}
                          placeholder={editText === "" ? "Input Task" : ""}
                        />

                        <label
                          className={`absolute ml-[-0.1rem] translate-x-[53.7rem] translate-y-[0.1rem] text-[0.85rem] opacity-45 outline-none ${editTime === "--:-- --" ? "pointer-events-none select-none text-transparent" : ""}`}
                        >
                          {new Date(
                            new Date().toLocaleDateString() +
                              " " +
                              editTime +
                              ":00",
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </label>

                        <input
                          className="absolute left-[56.9rem] mt-[-0.1rem] w-[1.9rem] scale-110 transform bg-transparent text-[0.9rem] opacity-45 outline-none transition-transform duration-200 hover:scale-125 active:scale-90"
                          type="time"
                          value={editTime}
                          onChange={handleTimeEditChange}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setEditTime("--:-- --");
                          }}
                          className="duration-400 absolute left-[59rem] z-50 mt-[0.3rem] translate-y-[-0.3rem] transform text-[1.2rem] opacity-45 transition-transform hover:scale-125 active:rotate-[-360deg]"
                        >
                          <RotateCcw size={20} />
                        </button>

                        <label
                          className={`absolute left-[64.8rem] ml-[-0.1rem] mt-[-0.1rem] translate-y-[0.1rem] text-[0.9rem] opacity-45 ${editDate === "mm/dd/yyyy" ? "pointer-events-none select-none text-transparent" : ""}`}
                        >
                          {editDate.split("-").reverse().join("/")}
                        </label>

                        <input
                          type="date"
                          className="absolute right-[12.3rem] mt-[-0.2rem] w-[1.33rem] translate-y-[-0.1rem] transform bg-transparent text-[1.2rem] opacity-45 outline-none transition-transform duration-200 hover:scale-125 active:scale-90"
                          value={editDate}
                          onChange={handleDateEditChange}
                        />

                        <button
                          type="button"
                          className="duration-400 absolute left-[72.2rem] mt-[0.3rem] translate-y-[-0.3rem] transform text-[1.2rem] opacity-45 transition-transform hover:scale-125 active:rotate-[-360deg]"
                          onClick={() => setEditDate("mm/dd/yyyy")}
                        >
                          <RotateCcw size={20} />
                        </button>

                        <button
                          onClick={() => saveEditing(task.task_id!)}
                          className="absolute right-[7rem] mt-[0rem] transform transition-transform duration-200 hover:scale-125 active:scale-90"
                        >
                          <Save size={20} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          startEditing(task.task_id, task.text, task.dueAt)
                        }
                        className={`${task.dueAt.getTime() !== 0 && task.dueAt.getTime() < new Date().getTime() ? "text-red-800" : ""} `}
                      >
                        <span className="absolute left-[3rem] max-w-[46.3rem] overflow-hidden text-ellipsis whitespace-nowrap">
                          {task.text}
                        </span>

                        {task.dueAt.getTime() !== 0 && (
                          <span>
                            <span className="absolute left-[53.6rem]">
                              {task.dueAt.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>

                            <span className="absolute left-[64.6rem]">
                              {task.dueAt
                                .toLocaleDateString([], {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                                .slice(3, 6) +
                                task.dueAt
                                  .toLocaleDateString([], {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .slice(0, 3) +
                                task.dueAt
                                  .toLocaleDateString([], {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .slice(6, 10)}
                            </span>
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      disabled={isEditing && editIndex !== task.task_id}
                      onClick={() => handleDeleteTask(task.task_id)}
                      className={`ml-[81.5rem] transform text-red-600 opacity-0 transition-transform duration-200 hover:scale-125 group-hover:opacity-100 active:scale-90${isEditing === true && editIndex === task.task_id ? "opacity-45" : ""}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.li>
                  </>
                ))}

                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <h1>
            <div
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="ml-[1rem] mt-[1rem] text-lg font-bold text-[#354F52]"
            >
              My Task
            </div>
          </h1>

          <div className="mt-[0.8rem] border-b-2"></div>

          {loading ? (
            <>
              <h1
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="fixed left-[23rem] top-[15.5rem] text-center text-2xl text-gray-500"
              >
                Fetching tasks...
              </h1>
             
            </> 
          ) : 
            filterTasks.length === 0 && (
              <>
                <img
                  src="src\assets\sleeping_penguin2.gif"
                  alt="No tasks available"
                  className="mx-auto mt-[2rem] h-[10rem] w-[10rem]"
                />
                <div
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="mt-[-1rem] text-center text-lg text-gray-500"
                >
                  No more tasks
                </div>
              </>
            )}
            <>
              <ul>
                {tasks
                     .filter(task => 
                      task.dueAt.getTime() > new Date().getTime() ||
                      task.dueAt.getTime() === new Date(0).getTime()
                    )
                    .sort((a, b) => {
                      if (a.dueAt && b.dueAt) {
                        const now = new Date().getTime();
                        const aDueTime = a.dueAt.getTime();
                        const bDueTime = b.dueAt.getTime();
                        return Math.abs(aDueTime - now) - Math.abs(bDueTime - now);
                      }
                      return 0; 
                    })
                  .slice(0, 5)
                  .map((task, index) => (
                    <motion.li key={index} className="mt-[0.6rem] border-b-2"
                    variants={afterloading ? taskVariants : undefined}
                    initial={afterloading ? "hidden" : undefined}
                    animate={afterloading ? "visible" : undefined}
                    exit={afterloading ? "visible" : undefined}
                    transition={
                      afterloading
                        ? { duration: 0.2, delay: index * delayPerItem }
                        : undefined
                    }>
                      <div className="mb-[0.8rem]">
                        <input
                          className="peer mb-[0rem] ml-[0.9rem] h-5 w-5 translate-y-[0.1rem] transform cursor-pointer appearance-none rounded-full border-[0.05rem] border-black bg-white shadow-lg transition-transform duration-300 checked:border-[#719191] checked:bg-[#719191] hover:scale-110 active:scale-50"
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => completeToggle(task.task_id!)}
                          disabled={taskInputDisable === task.task_id && afterMark}
                        />

                        <span
                          style={{
                            fontFamily: '"Signika Negative", sans-serif',
                          }}
                          className="absolute ml-3 text-lg font-semibold text-[#354F52]"
                        >
                           {task.text.length > 40 ? `${task.text.slice(0, 40)}...` : task.text}
                        </span>
                        <span
                          style={{
                            fontFamily: '"Signika Negative", sans-serif',
                            color:
                               displayStatus(task.dueAt) === "Today"
                                ? "#10B981"
                                : displayStatus(task.dueAt) === "Upcoming"
                                ? "#3B82F6"
                                : displayStatus(task.dueAt) === "Tomorrow"
                                ? "#F59E0B"
                                : "#6B7280"
                          }}
                          className={`
                            ${
                              displayStatus(task.dueAt) === "Today"
                                ? "ml-[27.5rem]"
                                : displayStatus(task.dueAt) === "Upcoming"
                                ? "ml-[26.5rem]"
                                : displayStatus(task.dueAt) === "Tomorrow"
                                ? "ml-[26.5rem]"
                                : "ml-[27.1rem]"
                                
                            } 
                            font-semibold
                          `}
                          >
                          {displayStatus(task.dueAt)}
                        </span>
                      </div>
                    </motion.li>
                  ))}
              </ul>
              {filterTasks.length > 0 && filterTasks.length <= 4 ? (
                <>
                  <div
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="mt-[0.5rem] text-center text-lg text-gray-500"
                  >
                    {" "}
                    {filterTasks.length === 1
                      ? "1 more task left"
                      : `${filterTasks.length} more tasks left`}
                  </div>
                </>
              ): null}
              
              <button
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="fixed top-[25rem] w-[35rem] rounded-bl-[1.5rem] rounded-br-[1.5rem] bg-[#354F52] py-2 text-white hover:bg-[#52796f]"
                onClick={() => navigate(`/ToDoList`)}
              >
                  {loading ? (
                  <span>Searching Tasks...</span>
                  ) : (
                    <>
                      {filterTasks.length === 0
                        ? "Add a Task"
                        : filterTasks.length > 5
                        ? `View ${filterTasks.length - 5} more`
                        : "Add more tasks"}
                    </>
                  )}
              </button>
            </>
        </div>
      </>
    );
  }
};

export default ToDoListComponent;