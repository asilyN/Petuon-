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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'Carmine_1';
// For when user login
CarmineDB_1.router.post('/userLogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_name, user_password } = req.body;
    try {
        // Validate input
        if (!user_name || !user_password) {
            res.status(400).json({ message: "Username and password are required." });
            return;
        }
        // Check if user exists in DB
        const userQuery = yield CarmineDB_1.pool.query(`SELECT * FROM users WHERE user_name = $1`, [user_name]);
        const user = userQuery.rows[0];
        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }
        // Check if password matches
        const passwordMatch = yield bcrypt_1.default.compare(user_password, user.user_password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ user_id: user.user_id, user_name: user.user_name }, JWT_SECRET, { expiresIn: '1h' } // Token expires in 1 hour
        );
        // Respond with token and user info
        res.status(200).json({
            message: `Login successful ${user.user_id}`,
            token,
            userId: user.user_id,
            userName: user.user_name,
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = CarmineDB_1.router;
