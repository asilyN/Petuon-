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
import sleepingPenguin from "../assets/sleeping_penguin2.gif"
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

    // setIsAnimatingDropDown(true);
    // setTimeout(() => {
    //   setIsAnimatingDropDown(false);
    // }, 10); // dropdown duration

    // if (lastTaskRef.current) {
    //   lastTaskRef.current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "end",
    //   });
    // }

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
        break;
      case "near":
        FilteredTasks = tasksBackup
          .filter(
            (task) => task.dueAt.getTime() > now.getTime() && !task.completed,
          )
          .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
        TasksMessage = "No near tasks available.";
        break;
      case "later":
        FilteredTasks = tasksBackup
          .filter(
            (task) => task.dueAt.getTime() > now.getTime() && !task.completed,
          )
          .sort((a, b) => b.dueAt.getTime() - a.dueAt.getTime());
        TasksMessage = "No tasks available for later.";
        break;
      case "default":
        FilteredTasks = tasksBackup;
        TasksMessage = "No active tasks available.";
        break;
      case "pastDue":
        FilteredTasks = tasksBackup.filter(
          (task) =>
            task.dueAt.getTime() !== 0 &&
            task.dueAt.getTime() < now.getTime() &&
            !task.completed,
        );
        TasksMessage = "No tasks past due.";
        break;
      case "completed":
        setAfterLoading(false);
        TasksMessage = "No tasks completed.";
        break;
      default:
        FilteredTasks = tasksBackup;
        TasksMessage = "No active tasks available.";
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

  async function saveEditing(task_id: string, due_at: Date) {
    setIsEditing(false);
    cancelEditing();
    console.log(due_at)
    console.log(due_at.getTime() == editTaskDateTime().getTime())
    if (
      editTaskDateTime() < new Date() &&
      !(editTime === "--:-- --" && editDate == "mm/dd/yyyy") &&
      !(due_at.getTime() == editTaskDateTime().getTime())
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
          className={`my-3 mb-0 ml-1 mt-[-4rem] flex space-x-2 font-serif font-bold text-[#354F52] scroll-none overflow-hidden`}
        >
          <div className="
            absolute flex-wrap
          ">
            {[
              { type: "default", label: "Default" },
              { type: "noDate", label: "NoDue" },
              { type: "near", label: "Near" },
              { type: "later", label: "Later" },
              { type: "pastDue", label: "PastDue" },
              { type: "completed", label: "Completed" },
            ].map((button) => (
              <button
                key={button.type}
                className={`
                  rounded-md 
                  px-3 py-1 text-xs     
                  sm:px-4 sm:py-2 sm:text-sm
                  md:px-6 md:py-3 md:text-base 
                  lg:px-4 lg:py-1.5 lg:text-lg 
                  xl:px-4 xl:py-1.5 xl:text-lg 
                  ${
                    filterType === button.type
                      ? "bg-[#657F83] text-white font-serif font-bold"
                      : "bg-none"
                  } 
                  hover:scale-110 transition-transform duration-300 ease-in-out
                `}
                onClick={() => filteredTasks(button.type)}
                >
                  {button.label}
                </button>
              ))}
            <form
              onSubmit={handleAddTask}
              className="
                transition-all duration-500 ease-in-out
                fixed top-40 w-[90%] h-[8%] max-w-[84rem] rounded-lg  
              bg-white pb-4 pt-4 text-black shadow-md  
                sm:left-9 sm:top-40 sm:h-[9%]
                md:left-9 md:top-40 md:w-[93%] md:h-[9%]
                lg:left-40 lg:top-40 lg:w-[84%] lg:h-[9%]
                xl:left-40 xl:top-40 xl:w-[90%] xl:h-[9%]
              "
            >
              <button
                type="submit"
                className="
                  ml-3 mt-[0.6rem] transform text-black transition-transform
                  duration-300 hover:scale-110 active:scale-50
                  sm:ml-4 sm:mt-1 sm:text-2xl
                  md:ml-4 md:mt-1
                  lg:ml-4 lg:mt-1
                  xl:ml- xl:mt-2
                "
              >
                <SquarePlus size={25} color="#354f52" />
              </button>

              <input
                className="
                  absolute ml-2 w-[70%] translate-y-[-5px] transform overflow-hidden 
                  text-ellipsis bg-transparent text-sm text-black outline-none 
                  text-[0.8rem] top-[2.1rem]
                  sm:w-[40%] sm:text-base sm:top-[1.6rem]
                  md:w-[46%] md:text-lg md:top-[1.6rem]
                  lg:w-[55%] lg:text-lg lg:top-[1.7rem]
                  xl:w-[60%] xl:text-xl xl:top-[1.7rem]
                "
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                type="text "
                placeholder="Enter a task"
                value={task}
                onChange={handleTextChange}
                required
              />

              <label
                className={`
                  absolute outline-none ${time === "--:-- --" ? "pointer-events-none select-none text-transparent" : ""}
                  right-[12.3rem] text-[0.7rem] top-[0.7rem] 
                  sm:right-[14rem] sm:text-[0.8rem] sm:top-[1.5rem]
                  md:right-[16.3rem] md:text-[0.8rem] md:top-[1.6rem]
                  lg:right-[16.6rem] lg:text-[0.8rem] lg:top-[1.6rem]
                  xl:right-[18rem] xl:text-[0.9rem] xl:top-[1.5rem]
                  `}
              >
                {displayTime}
              </label>

              <input
                className="
                    absolute w-[1.8rem] transform bg-transparent  text-white outline-none transition-transform duration-200 hover:scale-110 sm:hover:scale-125 active:scale-110
                    right-[10.7rem] top-[0.4rem] scale-75
                    sm:right-[12.5em] sm:top-[1.4rem] sm:scale-95
                    md:right-[14.6rem] md:top-[1.4rem] md:scale-100
                    lg:right-[14.8rem] lg:top-[1.4rem] lg:scale-105
                    xl:right-[16rem] xl:top-[1.4rem] xl:scale-110
                  "
                type="time"
                value={time}
                onChange={handleTimeChange}
              />

              <button
                type="button"
                onClick={() => setTime("--:-- --")}
                className="
                    duration-400 absolute transform transition-transform hover:scale-110 sm:hover:scale-125 active:rotate-[-360deg]
                    right-[9.5rem] top-[0.5rem] scale-75
                    sm:right-[11rem] sm:top-[1.5rem] sm:scale-95
                    md:right-[13rem] md:top-[1.5rem] md:scale-100
                    lg:right-[13rem] lg:top-[1.5rem] lg:scale-105
                    xl:right-[14.3rem] xl:top-[1.5rem] xl:scale-110
                  "
              >
                <RotateCcw size={20} color="black" />
              </button>

              <label
                className={`
                  absolute outline-none ${date === "mm/dd/yyyy" ? "pointer-events-none select-none text-transparent" : ""}
                  right-[3.8rem] text-[0.7rem] top-[0.65rem] 
                  sm:right-[5.3rem] sm:text-[0.8rem]  sm:top-[1.5rem] 
                  md:right-[5.8rem] md:text-[0.8rem]  md:top-[1.5rem] 
                  lg:right-[5.5rem] lg:text-[0.8rem] lg:top-[1.5rem]
                  xl:right-[6rem] xl:text-[0.9rem] xl:top-[1.4rem]
                  `}
              >
                {date.split("-").reverse().join("-")}
              </label>

              <input
                className="
                    absolute w-[1.55rem] transform bg-transparent text-[1.2rem] outline-none transition-transform duration-200 hover:scale-110 sm:hover:scale-125 active:scale-90
                    right-[2.2rem] top-[0.2rem] scale-75
                    sm:right-[3.5rem] sm:top-[1.2rem] sm:scale-95
                    md:right-[3.5rem] md:top-[1.2rem] md:scale-95
                    lg:right-[3.5rem] lg:top-[1.2rem] lg:scale-100
                    xl:right-[4rem] xl:scale-110
                  "
                type="date"
                value={date}
                onChange={handleDateChange}
              />

              <button
                type="button"
                onClick={() => setDate("mm/dd/yyyy")}
                className="
                  duration-400 absolute transform transition-transform hover:scale-110 sm:hover:scale-125 active:rotate-[-360deg]
                  right-[1rem] top-[0.5rem] scale-75
                  sm:right-[2rem] sm:top-[1.5rem] sm:scale-95
                  md:right-[2rem] md:top-[1.5rem] md:scale-95
                  lg:right-[2rem] lg:top-[1.5rem]  lg:scale-100
                  xl:right-[2.5rem] xl:scale-110
                "
              >
                <RotateCcw size={20} color="black" />
              </button>
            </form>
          </div>

          <div
            className={` flex space-x-2 font-normal`}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
          >
            {loading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                <h1  className="absolute  text-gray-500
                   transition-all duration-500 ease-in-out
                    w-[54%] text-lg
                    left-[40%] 
                    sm:left-[45%] sm-text2xl 
                    md:left-[45%] md:text-2xl
                    lg:left-[38%] lg:text-3xl
                    xl:left-[40%] 
                  ">
                  Fetching tasks...
                </h1>
              </div>
            ) : display.length === 0 ? (
              <div className="flex flex-col justify-center h-screen">
                <img
                  src={sleepingPenguin}
                  alt="No tasks available"
                  className={`absolute h-32 w-32 
                    transition-all duration-500 ease-in-out
                    top-[48%]
                    left-[40%] 
                    sm:left-[39%] sm:top-[50%]
                    md:left-[47%] md:top-[50%]
                    lg:left-[40%] lg:top-[45%]
                    xl:left-[41%] xl:top-[45%]
                  `}
                />
                <h1
                  className={`absolute  text-gray-500
                    w-[54%] text-lg
                   
                     ${
                    filterType === "default"
                      ? " left-[35%] sm:left-[30%] sm:text-xl md:left-[40%] md:text-2xl lg:left-[32%] lg:text-3xl xl:left-[35%]"
                      : filterType === "noDate"
                      ? " left-[28%] sm:left-[30%] sm:text-xl md:left-[35%] md:text-x2l lg:left-[28%] lg:text-3xl xl:left-[30%]"
                      : filterType === "near"
                      ? "left-[35%] sm:left-[35%] sm:text-xl md:left-[40%] md:text-2xl lg:left-[32%] lg:text-3xl xl:left-[35%]"
                      : filterType === "later"
                      ? "left-[32%] sm:left-[33%] sm:text-xl md:left-[38%] md:text-2xl lg:left-[31%] lg:text-3xl xl:left-[34%]"
                      : filterType === "pastDue"
                      ? "left-[38%] sm:left-[37%] sm:text-xl md:left-[44%] md:text-2xl lg:left-[37%] lg:text-3xl xl:left-[37%]"
                      : "left-[36%] sm:left-[35%] sm:text-xl md:left-[42%] md:text-2xl lg:left-[34%] lg:text-3xl xl:left-[37%]"}
                  `}
                >
                  {taskMessage}
                </h1>
              </div>
            ) : null}

            <div
              className={`absolute  left-[2.05rem] top-[14rem]  overflow-auto rounded-lg [&::-webkit-scrollbar]:w-2 overflow-x-hidden
                  w-[87%] h-[22.9rem]
                  sm:w-[90.5%] sm:h-[22.8rem]
                  md:w-[93.5%] md:h-[22.9rem]
                  lg:w-[84%]  lg:h-[26rem]
                  xl:w-[88%] xl:h-[28rem]
                `}
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
                    className={` 
                        mt-[-0.4rem] group flex flex-col whitespace-nowrap rounded-lg pb-4 pt-4 shadow-md transition-transform duration-1000 hover:shadow-lg 
                        ${isAnimatingDropDown ? "translate-y-[-65px] transform opacity-100" : ""}
                        sm:flex-row
                      `}
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
                          className="absolute left-[3rem]  overflow-hidden text-ellipsis bg-transparent opacity-45 outline-none
                          md:w-[20rem]
                          lg:w-[26rem]
                          xl:w-[46rem]"
                          type="text"
                          value={editText}
                          onChange={handleTextEditChange}
                          placeholder={editText === "" ? "Input Task" : ""}
                        />

                        <label
                          className={`absolute  ml-[-0.1rem]   translate-y-[0.1rem] text-[0.85rem] opacity-45 outline-none ${editTime === "--:-- --" ? "pointer-events-none select-none text-transparent" : ""}
                            ml-[56%] mt-[0.5rem]  
                          sm:ml-[50%] sm:mt-[0rem] sm:scale-100
                          md:ml-[50%]
                          lg:ml-[54%]
                          xl:ml-[64%] 
                          `}
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
                          className="absolute  w-[1.9rem]  transform bg-transparent text-[0.9rem] opacity-45 outline-none transition-transform duration-200 hover:scale-125 active:scale-90
                          ml-[70%] mt-[0.5rem] scale-75 
                          sm:ml-[57%] sm:mt-[-0.1rem] sm:scale-110
                          md:ml-[56%]
                          lg:ml-[60%]
                          xl:ml-[56.9rem] 
                          "
                          type="time"
                          value={editTime}
                          onChange={handleTimeEditChange}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setEditTime("--:-- --");
                          }}
                          className="duration-400 absolute  z-50  translate-y-[-0.3rem] transform text-[1.2rem] opacity-45 transition-transform hover:scale-125 active:rotate-[-360deg]
                          ml-[78%]  mt-[1rem] scale-75
                          sm:ml-[62%] sm:mt-[0.3rem] sm:scale-100
                          md:ml-[60%]
                          lg:ml-[64%]
                          xl:ml-[59rem]
                          "
                        >
                          <RotateCcw size={20} />
                        </button>

                        <label
                          className={`absolute ml-[-0.1rem]  translate-y-[0.1rem] opacity-45 ${editDate === "mm/dd/yyyy" ? "pointer-events-none select-none text-transparent" : ""}
                          text-[0.8rem]
                          ml-[54%] mt-[-1rem]
                          sm:ml-[68%] ml:text-[0.9rem] sm:mt-[-0.1rem]
                          md:ml-[70%]
                          lg:ml-[73%] 
                          xl:ml-[78%] 
                          `}
                        >
                          {editDate.split("-").reverse().join("/")}
                        </label>

                        <input
                          type="date"
                          className="absolute  w-[1.33rem] translate-y-[-0.1rem] transform bg-transparent text-[1.2rem] opacity-45 outline-none transition-transform duration-200 hover:scale-125 active:scale-90
                          
                          ml-[72%] mt-[-1rem] scale-75
                          sm:ml-[79%]  sm:mt-[-0.2rem] sm:scale-100
                          md:ml-[79%]
                          lg:ml-[82%]
                          xl:right-[12.3rem]
                          "
                          value={editDate}
                          onChange={handleDateEditChange}
                        />

                        <button
                          type="button"
                          className="duration-400 absolute  translate-y-[-0.3rem] transform text-[1.2rem] opacity-45 transition-transform hover:scale-125 active:rotate-[-360deg]
                          ml-[78%] mt-[-0.5rem] scale-75
                          sm:ml-[82%] sm:mt-[0.3rem] sm:scale-100
                          md:ml-[82%]
                          lg:ml-[85%]
                          xl:ml-[72rem]
                          "
                          onClick={() => setEditDate("mm/dd/yyyy")}
                        >
                          <RotateCcw size={20} />
                        </button>

                        <button
                          onClick={() => saveEditing(task.task_id, task.dueAt)}
                          className="absolute mt-[0rem] transform transition-transform duration-200 hover:scale-125 active:scale-90
                          ml-[86%]
                          sm:ml-[89%]
                          md:ml-[87%]
                          lg:ml-[90%]
                          xl:ml-[77rem] 
                          "
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
                        <span className="absolute left-[3rem]  overflow-hidden text-ellipsis whitespace-nowrap
                        w-[10rem]
                        sm:w-[14rem]
                        md:w-[20rem]
                        lg:w-[28rem]
                        xl:w-[46.3rem]
                        ">
                          {task.text}
                        </span>

                        {task.dueAt.getTime() !== 0 && (
                          <span>
                            <span className="absolute
                            left-[54%]  text-sm
                            sm:left-[50%]  sm:text-base
                            md:left-[50%]
                            lg:left-[55%]
                            xl:left-[53.6rem]">
                              {task.dueAt.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>

                            <span className="absolute 
                            left-[70%] text-sm
                            sm:left-[70%] sm:text-base
                            md:left-[70%]
                            lg:left-[75%]
                            xl:left-[64.6rem]">
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
                      className={`transform text-red-600 opacity-0 transition-transform duration-200 hover:scale-125 group-hover:opacity-100 active:scale-90${isEditing === true && editIndex === task.task_id ? "opacity-45" : ""}
                        ml-[92%]
                        sm:ml-[94%]
                        md:ml-[94%]
                        lg:ml-[95%]
                        xl:ml-[97%] 
                      `}
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
        <div className="flex flex-col h-full">
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
            <h1
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="fixed left-[23rem] top-[15.5rem] text-center text-2xl text-gray-500"
            >
              Fetching tasks...
            </h1>
          ) : (
            <div className="flex flex-1 flex-col">
              {filterTasks.length === 0 ? (
                <>
                  <img
                    src="src/assets/sleeping_penguin2.gif"
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
              ) : (
                <ul className="flex-1 overflow-auto">
                  {tasks
                    .filter(
                      (task) =>
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
                      <motion.li
                        key={index}
                        className="mt-[0.6rem] border-b-2"
                        variants={afterloading ? taskVariants : undefined}
                        initial={afterloading ? "hidden" : undefined}
                        animate={afterloading ? "visible" : undefined}
                        exit={afterloading ? "visible" : undefined}
                        transition={
                          afterloading
                            ? { duration: 0.2, delay: index * delayPerItem }
                            : undefined
                        }
                      >
                        <div className="flex items-center mb-[0.8rem]">
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
                            className="ml-2 flex-1 text-lg font-semibold text-[#354F52] truncate"
                          >
                            {task.text.length > 40
                              ? `${task.text.slice(0, 40)}...`
                              : task.text}
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
                                  : "#6B7280",
                            }}
                            className="mr-4 text-sm font-semibold"
                          >
                            {displayStatus(task.dueAt)}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                </ul>
              )}
    
              {filterTasks.length > 0 && filterTasks.length <= 4 && (
                <div
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="mt-[0.5rem] text-center text-lg text-gray-500"
                >
                  {filterTasks.length === 1
                    ? "1 more task left"
                    : `${filterTasks.length} more tasks left`}
                </div>
              )}
            </div>
          )}
    
          <div className="mt-auto">
            <button
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="w-full rounded-bl-[1.5rem] rounded-br-[1.5rem] bg-[#354F52] py-2 text-white hover:bg-[#52796f]"
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
          </div>
        </div>
      </>
    );
    
  }
};

export default ToDoListComponent;