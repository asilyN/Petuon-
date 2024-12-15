import React, { useState,} from 'react';
import { Flashcard, CreateFlashcardProps} from "../../types/FlashCardTypes";
import { ListPlus } from 'lucide-react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
 
export const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ flashcards, setFlashcards, flashCardId }) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const flashcard_id = flashCardId;
  

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const createFlashcard = async() => {
    if (question && answer) {
      const unique_flashcard_id = uuidv4();
      const newFlashcard: Flashcard = { question, answer, flashcard_id, unique_flashcard_id};
      const updatedFlashcards = [...flashcards, newFlashcard];
      setFlashcards(updatedFlashcards);
      console.log(`question: ${question}, answer: ${answer}, flashcardid: ${flashcard_id}, uniqueId: ${unique_flashcard_id}`);
      try {
        const flashcardData: Flashcard = {
          question, answer, flashcard_id, unique_flashcard_id
        };  
        const response = await axios.post('http://localhost:3002/cards/insertCard', 
          flashcardData
        );
        console.log(`Flashcard created: id: ${flashcard_id}, uniqueId: ${unique_flashcard_id}`, response);
        toast.success('Flashcard created!');
      }
      catch (error) {
        console.error('Error creating flashcard:', error);
      }
      setQuestion('');
      setAnswer('');
    } else {
      if (!question) {
        toast.warn('Please enter a question');
      }
      if (!answer) {
        toast.warn('Please enter an answer');
      }
    }
  };

  return (
    <div className="mt-[-2rem] flex flex-col md:flex-row justify-center items-center gap-10 p-4 ">
        <input
        type="text"
        value={question}
        onChange={handleQuestionChange}
        onKeyPress={(event) => {
        if (event.key === 'Enter') {
          if (question) {
            toast.warn('Please enter an answer');
            event.preventDefault();
            document.getElementById('answerInput')?.focus();
          } else {
            toast.warn('Please enter a question');
          }
        }
        }}
        style={{ fontFamily: '"Signika Negative", sans-serif' }} 
        className="h-16 rounded-3xl w-full md:w-1/3 p-5 shadow-xl border-2 border-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent placeholder-gray-300 text-white bg-[#657F83] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
        placeholder="Insert question"
        />
        <input
        id="answerInput"
        type="text"
        value={answer}
        onChange={handleAnswerChange}
        onKeyPress={(event) => {
        if (event.key === 'Enter') {
          createFlashcard();
        }
        }}
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="h-16 rounded-3xl w-full md:w-1/3 p-5 shadow-xl border-2 border-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent placeholder-gray-300 text-white bg-[#657F83] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
        placeholder="Insert answer"
        />
        <button
        onClick={createFlashcard}
        className="bg-[#657F83] text-white font-semibold h-16 w-16 shadow-xl rounded-full hover:bg-[#52796F] transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center transform hover:scale-110"
        >
        <ListPlus className="w-10 h-10 ml-2" />
        </button>
  </div>
  );
};