import { Request, Response } from 'express';
import { pool, router } from "../database/CarmineDB";
import authenticateToken from '../middleware/AuthMiddleware';
import bcrypt from 'bcrypt';


// Updates users profile
router.patch('/updateUser', authenticateToken, async (req: Request, res: Response) => {
    const { email, password, username } = req.body;
    const userId = req.user?.user_id;

    try {
        let updateQuery = 'UPDATE users SET ';
        const values: any[] = [];
        const setStatements: string[] = [];

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

        if (setStatements.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updateQuery += setStatements.join(', ') + ' WHERE user_id = $' + (setStatements.length + 1);
        values.push(userId);

        const result = await pool.query(updateQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
});

// get users data for editing
router.get('/getUsers', authenticateToken, async (req, res) => {
    const { email } = req.query; 

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);

      return res.status(200).json({
        message: 'Email is available',
        result: result.rows[0] 
      });
    
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while checking the email' });
    }
  });

export default router;
