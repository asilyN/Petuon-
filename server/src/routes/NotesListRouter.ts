import { Request, Response } from "express";
import { pool, router } from "../database/CarmineDB";
import authenticateToken from "../middleware/AuthMiddleware";

// Fetch all notes
router.get("/getNotes", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    const userId = req.user.user_id;

    // Assuming you're using a database like PostgreSQL
    const result = await pool.query("SELECT * FROM notes WHERE user_id = $1", [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Insert a new note
router.post("/insertNote", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    const { note_id, title, content, color, created_date, created_time } = req.body;
    const userId = req.user?.user_id;

    // Check for missing fields
    if (!title || !content || !color || !created_date || !created_time || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
    INSERT INTO notes (note_id, title, content, color, created_date, created_time, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;

    const result = await pool.query(query, [
      note_id,
      title,
      content,
      color,
      created_date,
      created_time,
      userId,
    ]);

    console.log("Inserted note:", result.rows[0]); // Log the inserted note
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting note:", error);
    if (error) {
      console.error("Database error code:", error);
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a note
router.delete("/deleteNote/:note_id", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    const { note_id } = req.params; // Make sure we use "id" here as per the table definition
    const userId = req.user?.user_id;

    if (!note_id) {
      return res.status(400).json({ message: "Missing note_id" });
    }
  
    // Use the correct column name ("id") in the SQL query
    const result = await pool.query(
      "DELETE FROM notes WHERE note_id = $1 AND user_id = $2 RETURNING *;",
      [note_id, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note deleted", deletedNote: result.rows[0] });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a note
router.patch("/updateNote/:note_id", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    const { note_id } = req.params;
    const { title, content, updatedAt } = req.body;
    const userId = req.user?.user_id;
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const query = `
            UPDATE notes 
            SET title = $1, content = $2, updated_at = $3
            WHERE note_id = $4 AND user_id = $5
            RETURNING *;
        `;
    const values = [title, content, updatedAt || new Date().toISOString(), note_id, userId];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res
      .status(200)
      .json({ message: "Note updated successfully.", note: result.rows[0] });

  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
