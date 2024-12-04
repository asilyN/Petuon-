import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { pool } from '../database/CarmineDB';

dotenv.config(); // Ensure environment variables are loaded

const router = express.Router();

// >>>> Define the server's endpoints

// Get all decks
router.get('/decks', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM decks');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post("/flashcards", async (req: Request, res: Response) => {
  const { question, answer, deckId } = req.body;

  try {
    if (!question || !answer || !deckId) {
      return res.status(400).json({ message: "Question, answer, and deckId are required" });
    }

    const result = await pool.query(
      "INSERT INTO flashcards (question, answer, deck_id) VALUES ($1, $2, $3) RETURNING *",
      [question, answer, deckId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating flashcard:", error);
    res.status(500).send("Internal Server Error");
  }
});



router.get('/decks/:deckId', async (req, res) => {
  const deckId = req.params.deckId;
  
  // Fetch deck by ID
  const deck = await pool.query('SELECT * FROM decks WHERE id = $1', [deckId]);

  // Check if deck exists
  if (deck.rows.length > 0) {
    // Return the first deck if found
    res.json(deck.rows[0]);
  } else {
    // If no deck found, send a 404 error
    res.status(404).send('Deck not found');
  }
});





router.get('/decks/:deckId/flashcards', async (req: Request, res: Response) => {
  const { deckId } = req.params;

  try {
      const result = await pool.query('SELECT * FROM flashcards WHERE deck_id = $1', [deckId]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching flashcards:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Add a new flashcard
router.post('/decks/:deckId/flashcards', async (req: Request, res: Response) => {
  const { deckId } = req.params;
  const { question, answer } = req.body;

  try {
      const query = 'INSERT INTO flashcards (deck_id, question, answer) VALUES ($1, $2, $3) RETURNING *';
      const values = [deckId, question, answer];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error adding flashcard:', error);
      res.status(500).send('Internal Server Error');
  }
});



// Define the /currentFlashcards route
router.get('/currentFlashcards', (req: Request, res: Response) => {
  res.json({ message: 'Current flashcards endpoint is working' });
});

// Create a new deck
// Add a new deck
router.post('/decks', async (req: Request, res: Response) => {
  const { title } = req.body;

  try {
      const query = 'INSERT INTO decks (title) VALUES ($1) RETURNING *';
      const result = await pool.query(query, [title]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error adding deck:', error);
      res.status(500).send('Internal Server Error');
  }
});                                       

// Add a flashcard to a deck
router.post('/insertCard', async (req: Request, res: Response) => {
  const { question, answer, deck_id } = req.body;

  if (!question || !answer || !deck_id) {
    return res.status(400).send('Question, answer, and deck_id are required');
  }

  try {
    const query =
      'INSERT INTO flashcards (deck_id, question, answer) VALUES ($1, $2, $3) RETURNING *';
    const values = [deck_id, question, answer];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting flashcard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a deck
router.delete('/decks/:deckId', async (req: Request, res: Response) => {
  const { deckId } = req.params;

  try {
    await pool.query('DELETE FROM decks WHERE id = $1', [deckId]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a flashcard
router.delete('/flashcards/:flashcardId', async (req: Request, res: Response) => {
  const { flashcardId } = req.params;

  try {
    await pool.query('DELETE FROM flashcards WHERE id = $1', [flashcardId]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update flashcards in a deck
router.put('/decks/:deckId/flashcards', async (req: Request, res: Response) => {
  const { deckId } = req.params;
  const { flashcards } = req.body;

  if (!Array.isArray(flashcards)) {
    return res.status(400).send('Flashcards must be an array');
  }

  try {
    // Delete existing flashcards for the specified deck
    await pool.query('DELETE FROM flashcards WHERE deck_id = $1', [deckId]);

    // Insert new flashcards for the specified deck
    for (const flashcard of flashcards) {
      const { question, answer } = flashcard;

      if (!question || !answer) {
        return res.status(400).send('Each flashcard must have a question and answer');
      }

      await pool.query(
        'INSERT INTO flashcards (deck_id, question, answer) VALUES ($1, $2, $3)',
        [deckId, question, answer]
      );
    }

    res.status(200).send('Flashcards updated successfully');
  } catch (error) {
    console.error('Error updating flashcards:', error);
    res.status(500).send('Internal Server Error');
  }
  
});
router.post('/insertCard', async (req: Request, res: Response) => {
  const { question, answer, deck_id } = req.body;

  if (!question || !answer || !deck_id) {
    return res.status(400).send('Question, answer, and deck_id are required');
  }

  try {
    const query =
      'INSERT INTO flashcards (deck_id, question, answer) VALUES ($1, $2, $3) RETURNING *';
    const values = [deck_id, question, answer];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting flashcard:', error);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
