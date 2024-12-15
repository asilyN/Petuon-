import { Request, Response } from "express";
import { pool, router } from "../database/CarmineDB";
import authenticateToken from "../middleware/AuthMiddleware";

// Fetch all pets
router.get("/getPets", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized: No user information" });
    }

    const userId = req.user.user_id;

    const result = await pool.query("SELECT * FROM pets WHERE user_id = $1", [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Error fetching pets" });
  }
});

// Insert a new pet
router.post("/insertPet", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized: No user information" });
    }

    const { pet_type, pet_name, pet_currency, pet_progress_bar, pet_evolution_rank, pet_max_value, created_date } = req.body;

    const userId = req.user?.user_id;
    console.log(userId)
    if (!pet_type || !pet_name || pet_currency == null || pet_progress_bar == null || !created_date || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkQuery = `SELECT * FROM pets WHERE user_id = $1;`;
    const existingPet = await pool.query(checkQuery, [userId]);

    if (existingPet.rows.length > 0) {
      return res.status(409).json({ message: "User already has a pet" }); // 409 Conflict
    }

    const query = `
      INSERT INTO pets (pet_type, pet_name, pet_currency, pet_progress_bar, pet_evolution_rank, pet_max_value, created_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;

    const result = await pool.query(query, [
      pet_type,
      pet_name,
      pet_currency,
      pet_progress_bar,
      pet_evolution_rank,
      pet_max_value,
      created_date,
      userId,  // Correctly include user_id here
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Delete a pet
router.delete("/deletePet/:pet_id", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized: No user information" });
    }

    const { pet_id } = req.params;
    const userId = req.user.user_id;

    if (!pet_id) {
      return res.status(400).json({ message: "Missing pet_id" });
    }

    const result = await pool.query(
      "DELETE FROM pets WHERE pet_id = $1 AND user_id = $2 RETURNING *;",
      [pet_id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted", deletedPet: result.rows[0] });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a pet
// Update a pet
// Update a pet
router.patch("/updatePet/:pet_id", authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized: No user information" });
    }

    const { pet_id } = req.params;
    const { pet_currency, pet_progress_bar, pet_evolution_rank, updated_date } = req.body;
    const userId = req.user.user_id;

    if (pet_currency == null || pet_progress_bar == null || pet_evolution_rank == null) {
      return res.status(400).json({ message: "Pet currency, progress bar, and evolution rank are required." });
    }

    // Fetch the current pet data to check evolution status
    const petResult = await pool.query(
      "SELECT * FROM pets WHERE pet_id = $1 AND user_id = $2",
      [pet_id, userId]
    );

    if (petResult.rowCount === 0) {
      return res.status(404).json({ message: "Pet not found." });
    }

    const pet = petResult.rows[0];
    let newProgressBar = pet_progress_bar;
    let newEvolutionRank = pet_evolution_rank || pet.pet_evolution_rank;  // Ensure it's updated
    let newMaxValue = pet.pet_max_value;

    // Check if progress bar exceeds max value
    if (newProgressBar >= pet.pet_max_value) {
      newProgressBar = 0; // Reset progress bar
      newEvolutionRank += 1; // Increment evolution rank

      // Adjust max value based on evolution rank
      if (newEvolutionRank === 4) {
        newMaxValue = 250; // Set max value for rank 4
      } else if (newEvolutionRank === 3) {
        newMaxValue = 200;
      } else {
        newMaxValue = 150;
      }

      if (newEvolutionRank > 4) {
        return res.status(400).json({
          message: "Pet has reached its maximum evolution rank.",
        });
      }
    }

    const query = `
      UPDATE pets 
      SET pet_currency = $1, pet_progress_bar = $2, pet_evolution_rank = $3, pet_max_value = $4, updated_date = $5
      WHERE pet_id = $6 AND user_id = $7
      RETURNING *;
    `;
    const values = [
      pet_currency,
      newProgressBar,
      newEvolutionRank,
      newMaxValue,
      updated_date || new Date().toISOString(),
      pet_id,
      userId,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Pet not found." });
    }

    return res.status(200).json({ message: "Pet updated successfully.", pet: result.rows[0] });
  } catch (error) {
    console.error("Error updating pet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});




export default router;
