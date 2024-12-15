import { Request, Response } from "express";
import { pool, router } from "../database/CarmineDB";

import authenticateToken  from '../middleware/AuthMiddleware'


import {
  validateGetTask,
  validateInsertTask,
  validateDeleteTask,
  validateCompleteTask,
  validateUpdateTask,
} from "../middleware/ToDoListMiddleware";

// Fetch all uncompleted tasks
router.get("/getTask", authenticateToken, validateGetTask, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    const userId = req.user.user_id;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE completed = false AND user_id = $1",
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all completed tasks
router.get("/getCompleteTask", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id; // Get the user ID from the authenticated user

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' });
    }

    const result = await pool.query(
      "SELECT * FROM tasks WHERE completed = true AND user_id = $1",
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Insert a new task
router.post(
  "/insertTask", 
  authenticateToken,
  validateInsertTask,
  async (req: Request, res: Response) => {
    try {
      const { task_id, text, createdAt, dueAt, completed } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
      }

      const query = `
          INSERT INTO tasks (task_id, text, created_at, due_at, completed, user_id)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;

      const values = [task_id, text, createdAt, dueAt, completed, userId];

      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error inserting task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Delete a task
router.delete(
  "/deleteTask/:task_id",
  authenticateToken,
  validateDeleteTask,
  async (req: Request, res: Response) => {
    try {
      const { task_id } = req.params;
      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
      }

      await pool.query("DELETE FROM tasks WHERE task_id = $1 AND user_id = $2", [task_id, userId]);
      res.status(200).send("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Mark a task as completed
router.patch(
  "/completeTask/:task_id",
  authenticateToken,
  validateCompleteTask,
  async (req: Request, res: Response) => {
    try {
      const { task_id } = req.params;
      const { completed } = req.body;
      const userId = req.user?.user_id;

       if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
      }

      const taskResult = await pool.query(
        "SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2",
        [task_id, userId]
      );

      if (taskResult.rowCount === 0) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }

      const query = `
          UPDATE tasks 
          SET completed = $1
          WHERE task_id = $2 AND user_id = $3
          RETURNING *;
        `;
      const values = [completed, task_id, userId];

      const result = await pool.query(query, values);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Update a task
router.patch("/updateTask/:task_id",
  authenticateToken,
  validateUpdateTask,
  async (req: Request, res: Response) => {
    try {
      const { task_id } = req.params;
      const { text, dueAt } = req.body;
      const userId = req.user?.user_id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID not found" });
      }

        const checkQuery = `
          SELECT * FROM tasks
          WHERE task_id = $1 AND user_id = $2;
      `;

      const checkValues = [task_id, userId];

      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rowCount === 0) {
        return res.status(404).json({ message: "Task not found or unauthorized" });
      }
      
      const query = `
          UPDATE tasks 
          SET text = $1, due_at = $2 
          WHERE task_id = $3 AND user_id = $4
          RETURNING *;
        `;
      const values = [text, dueAt, task_id, userId];

      const result = await pool.query(query, values);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
