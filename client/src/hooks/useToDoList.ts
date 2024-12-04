/* eslint-disable no-constant-condition */
/* eslint-disable no-constant-binary-expression */
import { useState, useEffect } from "react";
import axios from "axios";

// Import Task Interface
import { Task } from "../types/ToDoListTypes"

export const useToDoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksBackup, setTasksBackup] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("default");
  const [filterArr, setFilterArr] = useState<Task[]>([]);
  const [afterloading, setAfterLoading] = useState<boolean>(false);

    // Fetched Tasks
      const fetchTasks = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3002/tasks/getTask');
          const taskData = response.data.map((task: {task_id: string, text: string, created_at: Date, due_at: Date, completed: boolean }) => ({
            task_id: task.task_id,
            text: task.text,
            createdAt: new Date(task.created_at),
            dueAt: new Date(task.due_at),
            completed: task.completed,
          }));
          
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
        }, 1200) 
        }
        });

    useEffect(() => {
      fetchTasks();
    }, []);

    // Adding Tasks
    const addTask = async (newTask: Task) => {
      try {
        
        if (filterType === "default" || "later" || "near" || "noDue" || "pastDue") {
          setTasks([...tasks, newTask  ])
        } 
        
        setTasksBackup([...tasks, newTask]);
        

        await axios.post("http://localhost:3002/tasks/insertTask", newTask);
        
      } catch (error) {
        console.error("Error adding task:", error);
      }
    };
    
    // Delete Tasks
    const deleteTask = async (task_id: string ) => {
      try {
          setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
          setTasksBackup((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
          setFilterArr((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
          await axios.delete(`http://localhost:3002/tasks/deleteTask/${task_id}`);
          
        } catch (error) {
          console.error("Error deleting task:", error);
        }
    }



    // Complete Tasks
    const toggleCompleteTask = async (task_id: string) => {
      try {
        
        const taskToToggle = tasks.find((task) => task.task_id === task_id);
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
        

        await axios.patch(`http://localhost:3002/tasks/completeTask/${task_id}`, {
          completed: updatedCompletedStatus,
        });
        
    

      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    }

    // Saved Edited Tasks
    const saveEditedTask = async (
      task_id: string,
      updatedText: string,
      updatedDueAt: Date
    ) => {
      try {
        const trimmedText = updatedText.trim();

        setTasks(tasks.map(task =>
            task.task_id === task_id ? {...task, text: updatedText, dueAt: updatedDueAt} : task
        ));

        setTasksBackup(tasksBackup.map(task =>
            task.task_id === task_id ? {...task, text: updatedText, dueAt: updatedDueAt} : task
        ));

        setFilterArr(filterArr.map(task =>
          task.task_id === task_id ? {...task, text: updatedText, dueAt: updatedDueAt} : task
        ));

        if (trimmedText === "") {
          deleteTask(task_id)
        }

        await axios.patch(`http://localhost:3002/tasks/updateTask/${task_id}`, {
          text: trimmedText,
          dueAt: updatedDueAt,
        });
        
      } catch (error) {
        console.error("There was an error updating the task:", error);
      }

      
    };

    return {
      afterloading,
      setTasks,
      setTasksBackup,
      setFilterType,
      tasks,
      tasksBackup,
      loading,
      filterType,
      addTask,
      deleteTask,
      toggleCompleteTask,
      saveEditedTask,
      filterArr,
      setFilterArr,
      setAfterLoading
    }

   
}




