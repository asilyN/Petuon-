import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { quizFlashcardProps, Flashcard } from "../../types/FlashCardTypes";
import { useState, useEffect } from "react";
import axios from "axios";

export const QuizFlashcard: React.FC<quizFlashcardProps> = ({ setOnFirstPage }) => {
  const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [QuizFinished, setQuizFinished] = useState<boolean>(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get("/api/flashcards");
        const shuffledCards = shuffleArray(response.data as Flashcard[]);
        setTempFlashcards(shuffledCards);
        setCurrentIndex(0);
        setShowAnswer(false);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashcards();
  }, []);

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const shuffleFlashcards = () => {
    const shuffled = shuffleArray(tempFlashcards);
    setTempFlashcards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handleNextFlashcard = () => {
    if (currentIndex < tempFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setQuizFinished(true);
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const currentFlashcard = tempFlashcards[currentIndex];
  const isQuizComplete = currentIndex === tempFlashcards.length - 1 && showAnswer && QuizFinished;

  return (
    <div className="flex flex-col items-center justify-center h-[80%]">
      {isQuizComplete ? (
        <div className="inline items-center justify-center">
          <div className="mb-8">
            <div className="w-[80rem] h-[300px] bg-black rounded-2xl shadow-lg overflow-hidden ml-[-8rem]">
              <div
                className="bg-[#FE9B72] w-full h-full p-5 text-center cursor-pointer flex flex-col justify-center items-center"
                onClick={() => setShowAnswer((prev) => !prev)}
              >
                <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-4xl mb-5">{currentFlashcard.question}</h2>
                <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className={`text-xl ${showAnswer ? "text-black" : "text-gray-200"}`}>
                  {showAnswer ? currentFlashcard.answer : "Tap to show answer"}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-5 w-full">
              <button
                onClick={handlePreviousFlashcard}
                className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F] ml-[-8rem]"
                disabled={currentIndex === 0}
              >
                <CircleArrowLeft className="w-[3.5rem] h-[3.5rem] text-[#354F52]" />
              </button>
              <button
                onClick={handleNextFlashcard}
                className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
              >
                <CircleArrowRight className="w-[3.5rem] h-[3.5rem] text-[#354F52]" />
              </button>
            </div>
          </div>

          <div className="flex flex-col ml-[21rem] mt-[-5rem]">
            <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-4xl">Quiz complete! Well done!</p>
            <button
              onClick={shuffleFlashcards}
              style={{ fontFamily: '"Signika Negative", sans-serif' }} className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-5 ml-[7rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
            >
              Shuffle & Restart
            </button>
            <button
              onClick={() => setOnFirstPage(true)}
              style={{ fontFamily: '"Signika Negative", sans-serif' }} className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-5 ml-[7rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
            >
              Go to Flashcards
            </button>
          </div>
        </div>
      ) : (
        <div className="w-[80%] h-[450px] ml-[-8rem] flex flex-col items-center justify-center rounded-2xl">
          <div
            className="bg-[#FE9B72] rounded-2xl p-5 w-full text-center cursor-pointer flex flex-col justify-center items-center h-full shadow-lg"
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-6xl mb-5">{currentFlashcard.question}</h2>
            <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className={`text-3xl ${showAnswer ? "text-black" : "text-gray-400"}`}>
              {showAnswer ? currentFlashcard.answer : "Tap to show answer"}
            </p>
          </div>
          <div className="flex justify-between mt-5 w-full">
            <button
              onClick={handlePreviousFlashcard}
              className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
            >
              <CircleArrowLeft className="w-[3.5rem] h-[3.5rem] text-[#354F52]" />
            </button>
            <button
              onClick={handleNextFlashcard}
              className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
            >
              <CircleArrowRight className="w-[3.5rem] h-[3.5rem] text-[#354F52]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};