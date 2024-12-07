import express, { application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import LoginRouter from './routes/LoginRouter';
import RegisterRouter from "./routes/RegisterRouter";
import ToDoListRouter from "./routes/ToDoListRouter";
import NotesListRouter from "./routes/NotesListRouter";
import PetsRouter from "./routes/PetsRouter"

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


app.use('/pets', PetsRouter)

 // Start Server on port 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  }
 
)   

