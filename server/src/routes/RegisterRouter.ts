import { Request, Response } from 'express';
import { pool, router } from '../database/CarmineDB'
import bcrypt from 'bcrypt';
import { ValidateRegister } from '../middleware/RegisterMiddleware';

// Register a user
router.post(
    '/registerUser', 
    ValidateRegister, 
    async (req: Request, res: Response) => {
    const { user_password, user_id, user_email, user_name } = req.body;

    try { 
        // Check if the email already exists
        const checkQuery = `SELECT user_email FROM users WHERE user_email = $1`;
        const checkResult = await pool.query(checkQuery, [user_email]);

        if (checkResult.rows.length > 0) {
        // Email already exists
        return res.status(400).json({ message: 'Email is already registered' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);

        const query = `
        INSERT INTO users (user_id, user_email, user_name, user_password)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, user_email, user_name
        `;
        const values = [user_id, user_email, user_name, hashedPassword];

        const result =  await pool.query(query, values);
        res.status(201).json({
        message: 'User registered successfully',
        user: result.rows[0],
        });
        
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Server error');
    }
  });


export default router;