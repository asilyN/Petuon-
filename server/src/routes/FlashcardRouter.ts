import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { pool } from '../database/CarmineDB';

import authenticateToken  from '../middleware/AuthMiddleware'

dotenv.config(); // Ensure environment variables are loaded

const router = express.Router();

// Get all decks
router.get('/getDecks', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information' });
    }

    const userId = req.user.user_id;

    const result = await pool.query('SELECT * FROM decks WHERE user_id = $1', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Get flashcards for a specific deck
router.get('/getFlashcards', async (req: Request, res: Response) => {
  const { deck_id } = req.query;

  try {
    let query = 'SELECT * FROM flashcards';
    const values: string[] = [];

    // Filter by deck_id if provided
    if (deck_id) {
      query += ' WHERE flashcard_id = $1';
      values.push(deck_id as string);
    }

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Add a deck
router.post('/insertDecks', authenticateToken, async (req: Request, res: Response) => {
  const { deck_id, title } = req.body;
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID not found" });
  }

  try {
    const query = 'INSERT INTO decks (deck_id, title, user_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [deck_id, title, userId];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]); // Return the new deck
  } catch (error) {
    console.error('Error adding deck:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a flashcard to a deck
router.post('/insertCard', async (req: Request, res: Response) => {
  const { question, answer, flashcard_id, unique_flashcard_id} = req.body;
  console.log(req.body)

  if (!question || !answer || !flashcard_id || !unique_flashcard_id) {
    return res.status(400).send('Question, answer, and deck_id are required');
  }

  try {
    const query = 'INSERT INTO flashcards (question, answer, flashcard_id, unique_flashcard_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [question, answer, flashcard_id, unique_flashcard_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting flashcard:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Delete a deck
router.delete('/deleteDeck/:deckId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { deckId } = req.params;
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID not found" });
    }

    await pool.query('DELETE FROM flashcards WHERE flashcard_id = $1', [deckId]);
    await pool.query('DELETE FROM decks WHERE deck_id = $1 AND user_id = $2', [deckId, userId]);
    res.sendStatus(204); 
  } catch (error) {
    console.error(`Error deleting deck`, error);
    res.status(500).send('Failed to delete deck');
  }
});


// Delete a flashcard
router.delete('/deleteFlashcard/:unique_flashcard_id', async (req: Request, res: Response) => {
  const { unique_flashcard_id } = req.params;
  console.log(unique_flashcard_id);
  try {
    await pool.query('DELETE FROM flashcards WHERE unique_flashcard_id = $1', [unique_flashcard_id]);
    console.log(`Flashcard with ID ${unique_flashcard_id} deleted`);
    res.sendStatus(204); // No Content
  } catch (error) {
    console.error(`Error deleting flashcard with ID ${unique_flashcard_id}:`, error);
    res.status(500).send('Failed to delete flashcard');
  }
});
// Update a deck's title
router.put('/updateDeckTitle/:deckId', authenticateToken, async (req: Request, res: Response) => {
  const { deckId } = req.params; // Get the deck ID from the URL parameters
  const { title } = req.body; // Get the new title from the request body
  const userId = req.user?.user_id; // Get the user ID from the authenticated token

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required and cannot be empty" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID not found" });
  }

  try {
    const query = `
      UPDATE decks
      SET title = $1
      WHERE deck_id = $2 AND user_id = $3
      RETURNING *`;
    const values = [title, deckId, userId];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Deck not found or not owned by the user" });
    }

    res.status(200).json({ message: "Deck title updated successfully", deck: result.rows[0] });
  } catch (error) {
    console.error(`Error updating deck title for deck ID ${deckId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/updateFlashcard/:unique_flashcard_id', async (req, res) => {
  const { unique_flashcard_id } = req.params;
  const { question, answer } = req.body;

  // Only update the fields that are provided
  const updateFields = [];
  const updateValues = [];

  if (question) {
    updateFields.push('question');
    updateValues.push(question);
  }
  if (answer) {
    updateFields.push('answer');
    updateValues.push(answer);
  }

  if (updateFields.length === 0) {
    return res.status(400).send("No valid fields provided to update");
  }

  const updateQuery = `
    UPDATE flashcards 
    SET ${updateFields.map((field, idx) => `${field} = $${idx + 1}`).join(", ")} 
    WHERE unique_flashcard_id = $${updateFields.length + 1}
  `;

  try {
    await pool.query(updateQuery, [...updateValues, unique_flashcard_id]);
    res.status(200).send("Flashcard updated successfully");
  } catch (error) {
    console.error("Error updating flashcard:", error);
    res.status(500).send("Failed to update flashcard");
  }
});



// Update flashcard progress
router.put('/updateFlashcardProgress/:unique_flashcard_id', authenticateToken, async (req: Request, res: Response) => {
  const { unique_flashcard_id } = req.params;
  const { progress } = req.body;

  if (progress === undefined) {
    return res.status(400).json({ message: "Progress is required" });
  }

  try {
    // Run the query to update the flashcard's progress based on unique_flashcard_id
    const query = `
      UPDATE flashcards
      SET progress = $1
      WHERE unique_flashcard_id = $2
      RETURNING *`;
    const values = [progress, unique_flashcard_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.status(200).json({ message: "Flashcard progress updated", flashcard: result.rows[0] });
  } catch (error) {
    // Log full error for debugging
    console.error('Error updating flashcard progress:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: "An error occurred while updating flashcard progress", error: errorMessage });
  }
});




export default router;

