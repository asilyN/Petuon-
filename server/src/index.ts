import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';


import ToDoListRouter from "./routes/ToDoListRouter";
import FlashcardRouter from './routes/FlashcardRoutes';
import NotesListRouter from "./routes/NotesListRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/tasks', ToDoListRouter);
app.use('/flashcards', FlashcardRouter);


 // Start Server on port 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  }
 
)   


