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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateTask = exports.validateCompleteTask = exports.validateDeleteTask = exports.validateInsertTask = exports.validateGetTask = void 0;
const CarmineDB_1 = require("../database/CarmineDB");
const validateGetTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CarmineDB_1.pool.query("SELECT * FROM tasks");
        if (result.rows.length === 0) {
            console.log("No tasks found in the database");
        }
        console.log("Tasks found in the database");
        next();
    }
    catch (error) {
        console.error("Error getting tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.validateGetTask = validateGetTask;
const validateInsertTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { task_id, text, createdAt, dueAt, completed } = req.body;
        if (!task_id ||
            !text ||
            !createdAt ||
            !dueAt ||
            typeof completed !== "boolean") {
            console.log("Task data could not be inserted");
            return res
                .status(400)
                .json({ message: "All fields must be provided and valid" });
        }
        console.log("Task data inserted successfully");
        next();
    }
    catch (error) {
        console.error("Error inserting tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.validateInsertTask = validateInsertTask;
const validateDeleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { task_id } = req.params;
        if (!task_id) {
            console.log("Task data not deleted");
            return res.status(400).json({ message: "Task ID is not found" });
        }
        console.log("Task deleted succesfully");
        next();
    }
    catch (error) {
        console.error("Error validating task deletion:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.validateDeleteTask = validateDeleteTask;
const validateCompleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { task_id } = req.params;
        const { completed } = req.body;
        if (!task_id) {
            console.log("Task could not find id for completing task");
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (typeof completed !== "boolean") {
            console.log("Task could not check/uncheck");
            return res.status(400).json({ message: "Completed must be a boolean" });
        }
        console.log("Task successfully check/uncheck");
        next();
    }
    catch (error) {
        console.error("Error validating task completion:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.validateCompleteTask = validateCompleteTask;
const validateUpdateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { task_id } = req.params;
        const { text, dueAt } = req.body;
        if (!task_id) {
            console.log("Task could not find id for updating task");
            return res.status(400).json({ message: "Task ID is required" });
        }
        if (text !== undefined && typeof text !== "string") {
            console.log("Invalid String for updating");
            return res.status(400).json({ message: "Text must be a string" });
        }
        if (dueAt !== undefined) {
            const dueDate = new Date(dueAt);
            if (isNaN(dueDate.getTime())) {
                console.log("Invalid Date for updating");
                return res
                    .status(400)
                    .json({ message: "Due date must be a valid date" });
            }
        }
        console.log("Task successfully updated");
        next();
    }
    catch (error) {
        console.error("Error validating update task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.validateUpdateTask = validateUpdateTask;
