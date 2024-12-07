import { Request, Response } from 'express';
import { pool, router } from '../database/CarmineDB'

import {validateGetCompletedTask, validateGetActiveTask, validateInsertTask, validateDeleteTask, validateCompleteTask, validateUpdateTask } from '../middleware/ToDoListMiddleware';

// Fetch all uncompleted tasks
router.get('/getTask', validateGetActiveTask, async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE completed = false');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch all completed tasks
router.get('/getCompletedTask', validateGetCompletedTask, async (req: Request, res: Response) => {
    try {  
        const result = await pool.query('SELECT * FROM tasks WHERE completed = true');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Insert a new task
router.post('/insertTask', validateInsertTask, async (req: Request, res: Response) => {
    try {
        const { task_id, text, createdAt, dueAt, completed } = req.body;

        const query = `
            INSERT INTO tasks (task_id, text, created_at, due_at, completed)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        
        const values = [task_id, text, createdAt, dueAt, completed];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a task
router.delete('/deleteTask/:task_id', validateDeleteTask, async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;

        await pool.query('DELETE FROM tasks WHERE task_id = $1', [task_id]);
        res.status(200).send('Task deleted');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark a task as completed
router.patch('/completeTask/:task_id', validateCompleteTask, async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const { completed } = req.body;

        const query = `
            UPDATE tasks 
            SET completed = $1
            WHERE task_id = $2
            RETURNING *;
        `;
        const values = [completed, task_id];

        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a task
router.patch('/updateTask/:task_id', validateUpdateTask, async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const { text, dueAt } = req.body;

        const query = `
            UPDATE tasks 
            SET text = $1, due_at = $2 
            WHERE task_id = $3
            RETURNING *;
        `;
        const values = [text, dueAt, task_id];

        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
