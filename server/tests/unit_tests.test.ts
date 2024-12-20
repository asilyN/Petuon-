import { pool } from "../src/database/CarmineDB";
import { describe, beforeAll, afterAll, test, expect } from "@jest/globals";

describe("Unit Tests for Users Table Operations", () => {
  let testUserId: string;

  beforeAll(async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        "INSERT INTO users (user_id, user_email, user_password, user_name) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING user_id",
        ["test.user@example.com", "testpassword", "Test User"]
      );
      testUserId = result.rows[0].user_id; // Get the generated user_id
      await client.query("COMMIT");
    } catch (error) {
      console.error("Error setting up test data:", error);
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  });

  afterAll(async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      if (testUserId) {
        await client.query("DELETE FROM users WHERE user_id = $1", [testUserId]);
      }
      await client.query("COMMIT");
    } catch (error) {
      console.error("Error cleaning up test data:", error);
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  });

  test("Create: Insert a new user with explicit UUID generation", async () => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "INSERT INTO users (user_id, user_email, user_password, user_name) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING user_id",
        ["new.user@example.com", "password123", "New User"]
      );
      expect(result.rowCount).toBe(1);
      expect(result.rows[0]).toHaveProperty("user_id");

      // Clean up after the test
      await client.query("DELETE FROM users WHERE user_email = $1", ["new.user@example.com"]);
    } finally {
      client.release();
    }
  });

  test("Read: Retrieve a user by ID", async () => {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE user_id = $1", [testUserId]);
      expect(result.rowCount).toBe(1);
      expect(result.rows[0].user_email).toBe("test.user@example.com");
    } finally {
      client.release();
    }
  });

  test("Update: Modify a user's email", async () => {
    const client = await pool.connect();
    try {
      const newEmail = "updated.user@example.com";
      const result = await client.query(
        "UPDATE users SET user_email = $1 WHERE user_id = $2 RETURNING user_email",
        [newEmail, testUserId]
      );
      expect(result.rowCount).toBe(1);
      expect(result.rows[0].user_email).toBe(newEmail);
    } finally {
      client.release();
    }
  });

  test("Delete: Remove a user", async () => {
    const client = await pool.connect();
    try {
      // Ensure the user exists
      const result = await client.query("SELECT user_id FROM users WHERE user_email = $1", ["updated.user@example.com"]);
      const userId = result.rows[0]?.user_id;

      if (userId) {
        const deleteResult = await client.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id", [userId]);
        expect(deleteResult.rowCount).toBe(1);
      } else {
        throw new Error("User not found");
      }
    } finally {
      client.release();
    }
  });

  test("Error Handling: Inserting a user with duplicate email", async () => {
    const client = await pool.connect();
    try {
      // First insert a user
      await client.query(
        "INSERT INTO users (user_id, user_email, user_password, user_name) VALUES (gen_random_uuid(), $1, $2, $3)",
        ["duplicate.user@example.com", "password123", "Duplicate User"]
      );

      // Try inserting another user with the same email
      await expect(
        client.query(
          "INSERT INTO users (user_id, user_email, user_password, user_name) VALUES (gen_random_uuid(), $1, $2, $3)",
          ["duplicate.user@example.com", "password123", "Duplicate User"]
        )
      ).rejects.toThrow(/unique constraint/);

      // Clean up after the test
      await client.query("DELETE FROM users WHERE user_email = $1", ["duplicate.user@example.com"]);
    } finally {
      client.release();
    }
  });
});
