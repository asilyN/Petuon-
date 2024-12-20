/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
/* eslint-disable no-constant-binary-expression */
import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "../types/ToDoListTypes"


export const useToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksBackup, setTasksBackup] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("default");
  const [filterArr, setFilterArr] = useState<Task[]>([]);
  const [afterloading, setAfterLoading] = useState<boolean>(false);

  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [afterMark, setAfterMark] = useState<boolean>(false);
  const [shouldUpdateFilter, setShouldUpdateFilter] = useState(false);
  const [taskInputDisable, setTaskInputDisable] = useState<string>("");
  const token = localStorage.getItem('token');
  // Fetched Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error('No token found');
      }
      console.log(token)
      const response = await axios.get("http://localhost:3002/tasks/getTask",  
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response.data)
      const taskData = response.data.map(
        (task: {
          task_id: string;
          text: string;
          created_at: Date;
          due_at: Date;
          completed: boolean;
        }) => ({
          task_id: task.task_id,
          text: task.text,
          createdAt: new Date(task.created_at),
          dueAt: new Date(task.due_at),
          completed: task.completed,
        }),
      );
      const response1 = await axios.get(
        "http://localhost:3002/tasks/getCompleteTask",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const taskData1 = response1.data.map(
        (task: {
          task_id: string;
          text: string;
          created_at: Date;
          due_at: Date;
          completed: boolean;
        }) => ({
          task_id: task.task_id,
          text: task.text,
          createdAt: new Date(task.created_at),
          dueAt: new Date(task.due_at),
          completed: task.completed,
        }),
      );
      setCompletedTasks(taskData1);
      setTasks(taskData);
      setTasksBackup(taskData);
      setFilterArr(taskData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
      setAfterLoading(true);
    }
  };

  useEffect(() => {
    if (afterloading) {
      const timer = setTimeout(() => {
        setAfterLoading(false);
        return () => clearTimeout(timer);
      }, 1200);
    }
  });

  useEffect(() => {
    if (afterMark) {
      const timer = setTimeout(() => {
        setAfterMark(false);
        return () => clearTimeout(timer);
      }, 1200);
    }
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  // Adding Tasks
  const addTask = async (newTask: Task) => {
    try {
      if (loading) {
        alert("cannot add task in the moment....");
        return;
      }

      if (filterType === "default" || "later" || "near" || "noDue" || "pastDue") {
        setTasks([...tasks, newTask  ])
      } 

      setTasksBackup([...tasks, newTask]);

      await axios.post("http://localhost:3002/tasks/insertTask", newTask, 
      {
        headers: {
          Authorization: `Bearer ${token}` // Include the token for authentication
        }
      }); 

    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete Tasks
  const deleteTask = async (task_id: string) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));

      setTasksBackup((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));

      setFilterArr((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));

      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
      
      await axios.delete(`http://localhost:3002/tasks/deleteTask/${task_id}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Complete Tasks
  const toggleCompleteTask = async (task_id: string) => {
    try {
      const taskToToggle = (
        filterType === "pastDue" ||
        filterType === "near" ||
        filterType === "later" ||
        filterType === "noDate"
          ? filterArr
          : filterType === "completed"
            ? completedTasks
            : tasks
      ).find((task) => task.task_id === task_id);
      if (!taskToToggle) return;

      const updatedCompletedStatus = !taskToToggle.completed;

      setTasks(tasks.map(task =>
        task.task_id === task_id ? {...task, completed: !task.completed} : task
      ))
      setTasksBackup(tasksBackup.map(task => 
          task.task_id === task_id ? {...task, completed: !task.completed} : task
      ));
      setFilterArr(filterArr.map(task =>
        task.task_id === task_id ? {...task, completed: !task.completed} : task
      ))
      setCompletedTasks(completedTasks.map(task =>
        task.task_id === task_id ? {...task, completed: !task.completed} : task
      ))
      setAfterMark(true);
      setTaskInputDisable(taskToToggle.task_id);
      if (updatedCompletedStatus) {
        if (filterType != "completed") {
          setTimeout(() => {
            setCompletedTasks((prevCompletedTasks) => [
              ...prevCompletedTasks,
              { ...taskToToggle, completed: true },
            ]);
            setTasks((prevTasks) =>
              prevTasks.filter((task) => task.task_id !== task_id),
            );
            setTasksBackup((prevTasksBackup) =>
              prevTasksBackup.filter((task) => task.task_id !== task_id),
            );
            setFilterArr((prevFilterArr) =>
              prevFilterArr.filter((task) => task.task_id !== task_id),
            );
          }, 800);
        }
      } else {
        setTimeout(() => {
          setShouldUpdateFilter(true);
          setTasks((prevCompletedTasks) => [
            ...prevCompletedTasks,
            { ...taskToToggle, completed: false },
          ]);
          setTasksBackup((prevCompletedTasks) => [
            ...prevCompletedTasks,
            { ...taskToToggle, completed: false },
          ]);
          setFilterArr((prevCompletedTasks) => [
            ...prevCompletedTasks,
            { ...taskToToggle, completed: false },
          ]);

          setCompletedTasks((prevFilterArr) =>
            prevFilterArr.filter((task) => task.task_id !== task_id),
          );
        }, 800);
      }

      await axios.patch(`http://localhost:3002/tasks/completeTask/${task_id}`,
        {
          completed: updatedCompletedStatus, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  useEffect(() => {
    if (!shouldUpdateFilter) return;
    const now = new Date();

    // Filter tasks based on filterType
    if (filterType === "noDate") {
      setFilterArr(
        tasksBackup.filter(
          (task) => task.dueAt.getTime() === 0 && !task.completed,
        ),
      );
    } else if (filterType === "near") {
      setFilterArr(
        tasksBackup
          .filter(
            (task) => task.dueAt.getTime() > now.getTime() && !task.completed,
          )
          .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime()),
      );
    } else if (filterType === "later") {
      setFilterArr(
        tasksBackup
          .filter(
            (task) => task.dueAt.getTime() > now.getTime() && !task.completed,
          )
          .sort((a, b) => b.dueAt.getTime() - a.dueAt.getTime()),
      );
    } else if (filterType === "pastDue") {
      setFilterArr(
        tasksBackup
          .filter(
            (task) =>
              task.dueAt.getTime() !== 0 &&
              task.dueAt.getTime() < now.getTime() &&
              !task.completed,
          )
          .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime()),
      );
    } else {
      setFilterArr(tasksBackup); // Default: show all tasks
    }

    setShouldUpdateFilter(false);
  }, [filterType, tasksBackup]);

  // Saved Edited Tasks
  const saveEditedTask = async (
    task_id: string,
    updatedText: string,
    updatedDueAt: Date,
  ) => {
    try {
      const taskToToggle = (
        filterType === "pastDue" ||
        filterType === "near" ||
        filterType === "later" ||
        filterType === "noDate"
          ? filterArr
          : filterType === "completed"
            ? completedTasks
            : tasks
      ).find((task) => task.task_id === task_id);
      console.log(taskToToggle);
      const trimmedText = updatedText.trim();

      setTasks(
        tasks.map((task) =>
          task.task_id === task_id
            ? { ...task, text: updatedText, dueAt: updatedDueAt }
            : task,
        ),
      );

      setTasksBackup(
        tasksBackup.map((task) =>
          task.task_id === task_id
            ? { ...task, text: updatedText, dueAt: updatedDueAt }
            : task,
        ),
      );

      setFilterArr(
        filterArr.map((task) =>
          task.task_id === task_id
            ? { ...task, text: updatedText, dueAt: updatedDueAt }
            : task,
        ),
      );

      setCompletedTasks(
        completedTasks.map((task) =>
          task.task_id === task_id
            ? { ...task, text: updatedText, dueAt: updatedDueAt }
            : task,
        ),
      );

      if (filterType == "completed") {
        const task = completedTasks.find((task) => task.task_id === task_id);
        if (task) {
          const isDateTimeMismatched =
            task.dueAt.getTime() !== updatedDueAt.getTime();
          if (isDateTimeMismatched) {
            toggleCompleteTask(task_id);
          }
        }
      }

      if (trimmedText === "") {
        deleteTask(task_id);
      }

      await axios.patch(
        `http://localhost:3002/tasks/updateTask/${task_id}`,
        {
          text: trimmedText,          
          dueAt: updatedDueAt,        
        },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
    } catch (error) {
      console.error("There was an error updating the task:", error);
    }
  };
  return {
    setAfterLoading,
    setTasksBackup,
    setFilterType,
    setFilterArr,
    setTasks,
    afterloading,
    tasksBackup,
    filterType,
    filterArr,
    tasks,
    loading,
    addTask,
    afterMark,
    deleteTask,
    saveEditedTask,
    completedTasks,
    taskInputDisable,
    toggleCompleteTask,
  };
};
