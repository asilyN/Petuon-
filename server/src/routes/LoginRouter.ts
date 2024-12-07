import { Request, Response } from 'express';
import { pool, router } from '../database/CarmineDB'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'Carmine_1';

// Login route
router.post('/userLogin', async (req: Request, res: Response): Promise<void> => {
  const { user_name, user_password } = req.body;

  try {
    // Validate input
    if (!user_name || !user_password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    // Check if user exists in DB
    const userQuery = await pool.query(
      `SELECT * FROM users WHERE user_name = $1`,
      [user_name]
    );
    const user = userQuery.rows[0];
    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(user_password, user.user_password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, userName: user.user_name },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    // Respond with token and user info
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.user_id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
