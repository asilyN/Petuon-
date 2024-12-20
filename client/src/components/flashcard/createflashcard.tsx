import React, { useState } from 'react';
import { Flashcard, CreateFlashcardProps } from "../../types/FlashCardTypes";
import { ListPlus } from 'lucide-react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


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

  const createFlashcard = async () => {
    if (question && answer) {
      const unique_flashcard_id = uuidv4();
      const newFlashcard: Flashcard = {
        question, answer, flashcard_id, unique_flashcard_id,
        progress: false
      };
      const updatedFlashcards = [...flashcards, newFlashcard];
      setFlashcards(updatedFlashcards);
      console.log(`question: ${question}, answer: ${answer}, flashcardid: ${flashcard_id}, uniqueId: ${unique_flashcard_id}`);
      try {
        const flashcardData: Flashcard = {
          question, answer, flashcard_id, unique_flashcard_id,
          progress: false
        };
        const response = await axios.post('http://localhost:3002/cards/insertCard', flashcardData);
        console.log(`Flashcard created: id: ${flashcard_id}, uniqueId: ${unique_flashcard_id}`, response);
      } catch (error) {
        console.error('Error creating flashcard:', error);
      }
      setQuestion('');
      setAnswer('');
    } else {
      alert('Please enter a question and answer');
    }
  };

  // Function to delete a flashcard

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-8 mt-[-6rem]">
      <div className="w-full max-w-4xl p-6   rounded-xl  space-y-6 ">
        {/* Title */}
        <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-3xl font-semibold text-[#354F52]">Create a New Set</h2>

        {/* Question and Answer Inputs */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg font-medium text-[#354F52]">Question</label>
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
              className="mt-2 p-4 rounded-lg border-2 border-[#ccc] focus:ring-2 focus:ring-[#52796F] focus:border-transparent bg-[#f0f4f1] placeholder-[#9b9b9b] text-[#354F52] transition-transform duration-200 hover:scale-105"
              placeholder="Enter your question"
            />
          </div>
          <div className="flex flex-col">
            <label style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg font-medium text-[#354F52]">Answer</label>
            <input
              type="text"
              value={answer}
              onChange={handleAnswerChange}
              className="mt-2 p-4 rounded-lg border-2 border-[#ccc] focus:ring-2 focus:ring-[#52796F] focus:border-transparent bg-[#f0f4f1] placeholder-[#9b9b9b] text-[#354F52] transition-transform duration-200 hover:scale-105"
              placeholder="Enter the answer"
            />
          </div>
        </div>

        {/* Add Flashcard Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={createFlashcard}
            className="bg-[#52796F] text-white font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center hover:bg-[#354F52] transition-transform duration-100 hover:scale-105 "
          >
            <ListPlus className="w-5 h-5 mr-2" />
            Add Flashcard
          </button>
        </div>
      </div>
    </div>
  );
};
