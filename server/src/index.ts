import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import LoginRouter from './routes/LoginRouter';
import RegisterRouter from "./routes/RegisterRouter";
import ToDoListRouter from "./routes/ToDoListRouter";
import FlashcardRouter from './routes/FlashcardRouter';
import NotesListRouter from "./routes/NotesListRouter";
import PetsRouter from "./routes/PetsRouter"
import AvatarRouter from "./routes/AvatarRouter"
import EditProfileRouter from "./routes/EditProfileRouter"
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/tasks', ToDoListRouter);
app.use('/notes', NotesListRouter);
app.use('/register', RegisterRouter)
app.use('/login', LoginRouter);
app.use('/cards', FlashcardRouter);
app.use('/pets', PetsRouter)
app.use('/avatar', AvatarRouter);
app.use('/editprofile', EditProfileRouter)


app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

 // Start Server on port 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
