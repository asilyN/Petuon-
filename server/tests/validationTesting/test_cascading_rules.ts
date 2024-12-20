import { pool } from '../../src/database/CarmineDB'; 

export async function testCascadingRules() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Insert a user and a deck
      const res = await client.query("INSERT INTO users (user_id, user_email, user_password, user_name) VALUES (gen_random_uuid(), 'cascadeuser@example.com', 'password123', 'Cascade User') RETURNING user_id");
      const userId = res.rows[0].user_id;
  
      await client.query("INSERT INTO decks (deck_id, title, user_id) VALUES (gen_random_uuid(), 'Cascade Deck', $1)", [userId]);
  
      // Ensure the deck is inserted
      const deckRes = await client.query("SELECT * FROM decks WHERE user_id = $1", [userId]);
      if (deckRes.rows.length > 0) {
        console.log("Deck inserted for user:", userId);
      } else {
        console.log("No deck found for user:", userId);
      }
  
      //delete the user and ensure the deck is also deleted (ON DELETE CASCADE)
      await client.query("DELETE FROM users WHERE user_id = $1", [userId]);
  
      const deletedDeckRes = await client.query("SELECT * FROM decks WHERE user_id = $1", [userId]);
      if (deletedDeckRes.rows.length === 0) {
        console.log("Cascading delete worked! No deck found after user deletion.");
      } else {
        console.log("Cascading delete failed. Deck still exists.");
      }
  
      await client.query('COMMIT');
    } catch (error) {
      console.error("Error with cascading rules:", error);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }


