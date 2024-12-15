import { Request, Response, NextFunction } from 'express';
import { pool } from '../database/CarmineDB'

export const ValidateRegister =  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {user_email, user_name, user_password } = req.body;
                
        if (!user_email || !user_name || !user_password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        if (user_password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        const emailCheck = await pool.query(
            `SELECT * FROM users WHERE user_email = $1`,
            [user_email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        next();
     } catch (error) {
         console.error('Error checking for tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
     }
 }