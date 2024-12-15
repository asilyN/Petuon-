import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../database/CarmineDB';
import authenticateToken from '../middleware/AuthMiddleware';

const router = express.Router();

router.patch('/getUpdatedUser', authenticateToken, async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const userId = req.user?.user_id;

    try {
        // Start building the query
        let updateQuery = 'UPDATE users SET ';
        const values: any[] = [];
        const setStatements: string[] = [];

        // Conditionally add the fields to update
        if (email) {
            setStatements.push('user_email = $' + (setStatements.length + 1));
            values.push(email);
        }
        if (username) {
            setStatements.push('user_name = $' + (setStatements.length + 1));
            values.push(username);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            setStatements.push('user_password = $' + (setStatements.length + 1));
            values.push(hashedPassword);
        }

        // If there's no field to update, respond with an error
        if (setStatements.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        // Add the WHERE clause to ensure only the current user's info is updated
        updateQuery += setStatements.join(', ') + ' WHERE user_id = $' + (setStatements.length + 1);
        values.push(userId);

        // Execute the query
        const result = await pool.query(updateQuery, values);

        // Check if any row was updated
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
});

router.get('/getUsers', authenticateToken, async (req, res) => {
    const { email } = req.query; 

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      // Query the database to check if the email exists
        const result = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        
      // If email doesn't exist, return a success status
      return res.status(200).json({
        message: 'Email is available',
        result: result.rows[0] // Return the query result (could be an empty array if no rows are found)
      });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while checking the email' });
    }
  });

export default router;
