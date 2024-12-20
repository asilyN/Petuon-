"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const LoginRouter_1 = __importDefault(require("./routes/LoginRouter"));
const RegisterRouter_1 = __importDefault(require("./routes/RegisterRouter"));
const ToDoListRouter_1 = __importDefault(require("./routes/ToDoListRouter"));
const FlashcardRouter_1 = __importDefault(require("./routes/FlashcardRouter"));
const NotesListRouter_1 = __importDefault(require("./routes/NotesListRouter"));
const PetsRouter_1 = __importDefault(require("./routes/PetsRouter"));
const AvatarRouter_1 = __importDefault(require("./routes/AvatarRouter"));
const EditProfileRouter_1 = __importDefault(require("./routes/EditProfileRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use('/tasks', ToDoListRouter_1.default);
app.use('/notes', NotesListRouter_1.default);
app.use('/register', RegisterRouter_1.default);
app.use('/login', LoginRouter_1.default);
app.use('/cards', FlashcardRouter_1.default);
app.use('/pets', PetsRouter_1.default);
app.use('/avatar', AvatarRouter_1.default);
app.use('/editprofile', EditProfileRouter_1.default);
// Start Server on port 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
