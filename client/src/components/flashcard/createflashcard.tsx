import React, { useState, useRef } from 'react';
import { Flashcard, CreateFlashcardProps } from "../../types/FlashCardTypes";
import { ListPlus } from 'lucide-react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      createFlashcard(); 
    }
  };

  const questionRef = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  const createFlashcard = async () => {
    if (question && answer) {
      const unique_flashcard_id = uuidv4();
      const newFlashcard: Flashcard = {
        question, answer, flashcard_id, unique_flashcard_id,
        progress: false
      };
      const updatedFlashcards = [...flashcards, newFlashcard];
      setFlashcards(updatedFlashcards);

      toast.success('Flashcard created!');
      console.log(`question: ${question}, answer: ${answer}, flashcardid: ${flashcard_id}, uniqueId: ${unique_flashcard_id}`);

      try {
        const flashcardData: Flashcard = {
          question, answer, flashcard_id, unique_flashcard_id,
          progress: false
        };
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/cards/insertCard`, flashcardData);
        console.log(`Flashcard created: id: ${flashcard_id}, uniqueId: ${unique_flashcard_id}`, response);
      } catch (error) {
        console.error('Error creating flashcard:', error);
      }
      setQuestion('');
      setAnswer('');
    } else {
      if (!question && !answer) {
        questionRef.current && questionRef.current.focus();
        toast.info('Question and answer are required');
      } else if (!question && questionRef.current) {
        questionRef.current.focus();
        toast.info('Please enter a question');
      } else if (!answer && answerRef.current) {
        answerRef.current.focus();
        toast.info('Please enter an answer');
      }
    }
  };

  // Function to delete a flashcard

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-8 mt-[-6rem]">
      <div className="w-full max-w-4xl p-6   rounded-xl  space-y-6 ">
        {/* Title */}
        <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg lg:text-3xl font-semibold text-[#354F52] mt-12 -ml-12">Create a New Set</h2>

        {/* Question and Answer Inputs */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <label style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-sm lg:text-lg font-medium text-[#354F52]">Question</label>
            <input
              ref={questionRef}
              type="text"
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleEnter}
              className="mt-2 p-4 rounded-lg border-2 border-[#ccc] focus:ring-2 focus:ring-[#52796F] focus:border-transparent bg-[#f0f4f1] placeholder-[#9b9b9b] text-[#354F52] transition-transform duration-200 hover:scale-105 "
              placeholder="Enter your question"
            />
          </div>
          <div className="flex flex-col">
            <label style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-sm lg:text-lg font-medium text-[#354F52]">Answer</label>
            <input
              ref={answerRef}
              type="text"
              value={answer}
              onChange={handleAnswerChange}
              onKeyDown={handleEnter}
              className="mt-2 p-4 rounded-lg border-2 border-[#ccc] focus:ring-2 focus:ring-[#52796F] focus:border-transparent bg-[#f0f4f1] placeholder-[#9b9b9b] text-[#354F52] transition-transform duration-200 hover:scale-105"
              placeholder="Enter the answer"
            />
          </div>
        </div>

        {/* Add Flashcard Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={createFlashcard}
            className="bg-[#354F52] text-sm md:text-base text-white font-semibold py-2 px-4 rounded-lg shadow-lg flex items-center hover:bg-[#52796F] transition-transform duration-100 hover:scale-105 "
          >
            <ListPlus className="w-5 h-5 mr-2" />
            Add Flashcard
          </button>
        </div>
      </div>
    </div>
  );
};
