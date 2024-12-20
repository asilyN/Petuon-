"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CarmineDB_1 = require("../database/CarmineDB");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
// Fetch all pets
CarmineDB_1.router.get("/getPets", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: "Unauthorized: No user information" });
        }
        const userId = req.user.user_id;
        const result = yield CarmineDB_1.pool.query("SELECT * FROM pets WHERE user_id = $1", [userId]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ message: "Error fetching pets" });
    }
}));
// Insert a new pet
CarmineDB_1.router.post("/insertPet", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: "Unauthorized: No user information" });
        }
        const { pet_type, pet_name, pet_currency, pet_progress_bar, pet_evolution_rank, pet_max_value, created_date } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        console.log(userId);
        if (!pet_type || !pet_name || pet_currency == null || pet_progress_bar == null || !created_date || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const checkQuery = `SELECT * FROM pets WHERE user_id = $1;`;
        const existingPet = yield CarmineDB_1.pool.query(checkQuery, [userId]);
        if (existingPet.rows.length > 0) {
            return res.status(409).json({ message: "User already has a pet" }); // 409 Conflict
        }
        const query = `
      INSERT INTO pets (pet_type, pet_name, pet_currency, pet_progress_bar, pet_evolution_rank, pet_max_value, created_date, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;
        const result = yield CarmineDB_1.pool.query(query, [
            pet_type,
            pet_name,
            pet_currency,
            pet_progress_bar,
            pet_evolution_rank,
            pet_max_value,
            created_date,
            userId, // Correctly include user_id here
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error inserting pet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Delete a pet
CarmineDB_1.router.delete("/deletePet/:pet_id", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ message: "Unauthorized: No user information" });
        }
        const { pet_id } = req.params;
        const userId = req.user.user_id;
        if (!pet_id) {
            return res.status(400).json({ message: "Missing pet_id" });
        }
        const result = yield CarmineDB_1.pool.query("DELETE FROM pets WHERE pet_id = $1 AND user_id = $2 RETURNING *;", [pet_id, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found" });
        }
        res.status(200).json({ message: "Pet deleted", deletedPet: result.rows[0] });
    }
    catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Update a pet
// Update a pet
// Update a pet
CarmineDB_1.router.patch("/updatePet/:pet_id", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const petResult = yield CarmineDB_1.pool.query("SELECT * FROM pets WHERE pet_id = $1 AND user_id = $2", [pet_id, userId]);
        if (petResult.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }
        const pet = petResult.rows[0];
        let newProgressBar = pet_progress_bar;
        let newEvolutionRank = pet_evolution_rank || pet.pet_evolution_rank; // Ensure it's updated
        let newMaxValue = pet.pet_max_value;
        // Check if progress bar exceeds max value
        if (newProgressBar >= pet.pet_max_value) {
            newProgressBar = 0; // Reset progress bar
            newEvolutionRank += 1; // Increment evolution rank
            // Adjust max value based on evolution rank
            if (newEvolutionRank === 4) {
                newMaxValue = 250; // Set max value for rank 4
            }
            else if (newEvolutionRank === 3) {
                newMaxValue = 200;
            }
            else {
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
        const result = yield CarmineDB_1.pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }
        return res.status(200).json({ message: "Pet updated successfully.", pet: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating pet:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}));
CarmineDB_1.router.patch('/updatePetCurrency', AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pet_currency, pet_id } = req.body;
        if (pet_currency == null) {
            return res.status(400).json({ message: "Pet currency is required." });
        }
        // Fetch the current pet data to ensure it exists
        const petResult = yield CarmineDB_1.pool.query("SELECT * FROM pets WHERE pet_id = $1", [pet_id]);
        if (petResult.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }
        const newPetCurrency = petResult.rows[0].pet_currency + pet_currency;
        const query = `
      UPDATE pets 
      SET pet_currency = $1, updated_date = $2
      WHERE pet_id = $3
      RETURNING *;
    `;
        const values = [newPetCurrency, new Date().toISOString(), pet_id];
        const result = yield CarmineDB_1.pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Pet not found." });
        }
        return res.status(200).json({ message: "Pet currency updated successfully.", pet: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating pet currency:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}));
exports.default = CarmineDB_1.router;
