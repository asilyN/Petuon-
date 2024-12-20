import { pool } from '../src/database/CarmineDB'; 

export async function testForeignKeyIntegrity() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Test foreign key integrity for 'user_id' (should fail if invalid user_id is provided)
      try {
        await client.query("INSERT INTO decks (deck_id, title, user_id) VALUES (gen_random_uuid(), 'Deck 1', 'invalid-uuid')");
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error with foreign key integrity:", error.message);
        } else {
          console.log("Unknown error with foreign key integrity:", error);
        }
      }
  
      // Test inserting a valid user and then inserting a deck with the correct user_id
      const res = await client.query("INSERT INTO users (user_id, user_email, user_password, user_name) VALUES (gen_random_uuid(), 'validuser@example.com', 'password123', 'Valid User') RETURNING user_id");
      const validUserId = res.rows[0].user_id;
  
      await client.query("INSERT INTO decks (deck_id, title, user_id) VALUES (gen_random_uuid(), 'Deck 2', $1)", [validUserId]);
  
      console.log("Foreign key integrity test passed!");
  
      await client.query('COMMIT');
    } catch (error) {
      console.error("Error with foreign key integrity:", error);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }