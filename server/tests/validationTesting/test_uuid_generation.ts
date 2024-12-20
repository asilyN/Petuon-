import { pool } from '../../src/database/CarmineDB'; 

export async function testUuidGeneration() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Attempt to insert a user without specifying a UUID (should automatically generate a UUID)
      try {
        const result = await client.query("INSERT INTO users (user_email, user_password, user_name) VALUES ('john.doe@example.com', 'password123', 'John Doe') RETURNING user_id");
        const userId = result.rows[0].user_id;
        console.log("Generated UUID for user:", userId);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log("Error with UUID generation:", error.message);
        } else {
          console.log("Unknown error with UUID generation:", error);
        }
      }
  
      await client.query('COMMIT');
    } catch (error) {
      console.error("Error with UUID generation:", error);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }


