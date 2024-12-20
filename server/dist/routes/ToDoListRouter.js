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
const ToDoListMiddleware_1 = require("../middleware/ToDoListMiddleware");
// Fetch all uncompleted tasks
CarmineDB_1.router.get("/getTask", AuthMiddleware_1.default, ToDoListMiddleware_1.validateGetTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }
        const userId = req.user.user_id;
        const result = yield CarmineDB_1.pool.query("SELECT * FROM tasks WHERE completed = false AND user_id = $1", [userId]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching tasks: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Fetch all completed tasks
CarmineDB_1.router.get("/getCompleteTask", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id; // Get the user ID from the authenticated user
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: User ID not found' });
        }
        const result = yield CarmineDB_1.pool.query("SELECT * FROM tasks WHERE completed = true AND user_id = $1", [userId]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Insert a new task
CarmineDB_1.router.post("/insertTask", AuthMiddleware_1.default, ToDoListMiddleware_1.validateInsertTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { task_id, text, createdAt, dueAt, completed } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }
        const query = `
          INSERT INTO tasks (task_id, text, created_at, due_at, completed, user_id)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const values = [task_id, text, createdAt, dueAt, completed, userId];
        const result = yield CarmineDB_1.pool.query(query, values);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Delete a task
CarmineDB_1.router.delete("/deleteTask/:task_id", AuthMiddleware_1.default, ToDoListMiddleware_1.validateDeleteTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { task_id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }
        yield CarmineDB_1.pool.query("DELETE FROM tasks WHERE task_id = $1 AND user_id = $2", [task_id, userId]);
        res.status(200).send("Task deleted");
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Mark a task as completed
CarmineDB_1.router.patch("/completeTask/:task_id", AuthMiddleware_1.default, ToDoListMiddleware_1.validateCompleteTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { task_id } = req.params;
        const { completed } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }
        const taskResult = yield CarmineDB_1.pool.query("SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2", [task_id, userId]);
        if (taskResult.rowCount === 0) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        const query = `
          UPDATE tasks 
          SET completed = $1
          WHERE task_id = $2 AND user_id = $3
          RETURNING *;
        `;
        const values = [completed, task_id, userId];
        const result = yield CarmineDB_1.pool.query(query, values);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Update a task
CarmineDB_1.router.patch("/updateTask/:task_id", AuthMiddleware_1.default, ToDoListMiddleware_1.validateUpdateTask, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { task_id } = req.params;
        const { text, dueAt } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found" });
        }
        const checkQuery = `
          SELECT * FROM tasks
          WHERE task_id = $1 AND user_id = $2;
      `;
        const checkValues = [task_id, userId];
        const checkResult = yield CarmineDB_1.pool.query(checkQuery, checkValues);
        if (checkResult.rowCount === 0) {
            return res.status(404).json({ message: "Task not found or unauthorized" });
        }
        const query = `
          UPDATE tasks 
          SET text = $1, due_at = $2 
          WHERE task_id = $3 AND user_id = $4
          RETURNING *;
        `;
        const values = [text, dueAt, task_id, userId];
        const result = yield CarmineDB_1.pool.query(query, values);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = CarmineDB_1.router;
