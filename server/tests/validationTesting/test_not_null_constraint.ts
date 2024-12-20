import { pool } from '../src/database/CarmineDB'; 

export async function testNotNullConstraint() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Attempt to insert a user with a NULL email (should fail)
      try {
        await client.query("INSERT INTO users (user_email, user_password, user_name) VALUES (NULL, 'password123', 'John Doe')");
      } catch (error: unknown) {
        // Type assertion to Error to access the message property
        if (error instanceof Error) {
          console.log("Error with NULL email:", error.message);
        } else {
          console.log("Unknown error with NULL email:", error);
        }
      }
  
      // Attempt to insert a user with a NULL password (should fail)
      try {
        await client.query("INSERT INTO users (user_email, user_password, user_name) VALUES ('john.doe@example.com', NULL, 'John Doe')");
      } catch (error: unknown) {
        // Type assertion to Error to access the message property
        if (error instanceof Error) {
          console.log("Error with NULL password:", error.message);
        } else {
          console.log("Unknown error with NULL password:", error);
        }
      }
  
      // Attempt to insert a user with a NULL name (should fail)
      try {
        await client.query("INSERT INTO users (user_email, user_password, user_name) VALUES ('john.doe@example.com', 'password123', NULL)");
      } catch (error: unknown) {
        // Type assertion to Error to access the message property
        if (error instanceof Error) {
          console.log("Error with NULL name:", error.message);
        } else {
          console.log("Unknown error with NULL name:", error);
        }
      }
  
      await client.query('COMMIT');
    } catch (error) {
      console.error("Error with NOT NULL constraint:", error);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
  }

  