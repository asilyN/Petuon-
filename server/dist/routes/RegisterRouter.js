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
const RegisterMiddleware_1 = require("../middleware/RegisterMiddleware");
// Register a user
CarmineDB_1.router.post('/registerUser', RegisterMiddleware_1.ValidateRegister, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_password, user_id, user_email, user_name } = req.body;
    try {
        // Check if the email already exists
        const checkQuery = `SELECT user_email FROM users WHERE user_email = $1`;
        const checkResult = yield CarmineDB_1.pool.query(checkQuery, [user_email]);
        if (checkResult.rows.length > 0) {
            // Email already exists
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(user_password, saltRounds);
        const query = `
        INSERT INTO users (user_id, user_email, user_name, user_password)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, user_email, user_name
        `;
        const values = [user_id, user_email, user_name, hashedPassword];
        const result = yield CarmineDB_1.pool.query(query, values);
        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0],
        });
    }
    catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Server error');
    }
}));
exports.default = CarmineDB_1.router;
