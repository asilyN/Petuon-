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
const bcrypt_1 = __importDefault(require("bcrypt"));
// Updates users profile
CarmineDB_1.router.patch('/updateUser', AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, username } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
    try {
        let updateQuery = 'UPDATE users SET ';
        const values = [];
        const setStatements = [];
        if (email) {
            setStatements.push('user_email = $' + (setStatements.length + 1));
            values.push(email);
        }
        if (username) {
            setStatements.push('user_name = $' + (setStatements.length + 1));
            values.push(username);
        }
        if (password) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            setStatements.push('user_password = $' + (setStatements.length + 1));
            values.push(hashedPassword);
        }
        if (setStatements.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        updateQuery += setStatements.join(', ') + ' WHERE user_id = $' + (setStatements.length + 1);
        values.push(userId);
        const result = yield CarmineDB_1.pool.query(updateQuery, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
}));
// get users data for editing
CarmineDB_1.router.get('/getUsers', AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        const result = yield CarmineDB_1.pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
        return res.status(200).json({
            message: 'Email is available',
            result: result.rows[0]
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while checking the email' });
    }
}));
exports.default = CarmineDB_1.router;
