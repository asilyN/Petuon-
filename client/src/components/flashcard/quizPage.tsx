import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { quizFlashcardProps, Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const correctSound = new URL("../../assets/soundEffects/correct_sound.mp3", import.meta.url).href;
const incorrectSound = new URL("../../assets/soundEffects/incorrect_sound.mp3", import.meta.url).href;

export const QuizFlashcard: React.FC<quizFlashcardProps> = ({ setOnFirstPage, flashcards }) => {
  const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizState, setQuizState] = useState<"review" | "fillBlanks" | "finished">("review");
  const [userScore, setUserScore] = useState(0);
  const [petCurrency, setPetCurrency] = useState(0); // New state variable
  const [attempts, setAttempts] = useState(3);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "incorrect" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const correctAudio = new Audio(correctSound);
  const incorrectAudio = new Audio(incorrectSound);

  useEffect(() => {
    if (flashcards?.length) {
      setTempFlashcards(shuffleArray(flashcards));
    }
  }, [flashcards]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleNextFlashcard = () => {
    if (currentIndex < tempFlashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetFlashcardState();
    } else {
      setQuizState("finished");
    }
  };

  const shuffleFlashcards = () => {
    const shuffled = shuffleArray(tempFlashcards);
    setTempFlashcards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const handlePreviousFlashcard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetFlashcardState();
    }
  };

  const resetFlashcardState = () => {
    setShowAnswer(false);
    setUserInput("");
    setAnswerStatus(null);
    setAttempts(3);
  };

  const handleStartNewQuiz = () => {
    setQuizState("fillBlanks");
    setCurrentIndex(0);
    setUserScore(0);
    setTempFlashcards(shuffleArray(tempFlashcards));
    resetFlashcardState();
  };

  const handleCheckAnswer = async () => {
    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = tempFlashcards[currentIndex]?.answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      toast.success("Correct answer! Well done!");
      correctAudio.play();
      setUserScore((prev) => prev + 1);
      setAnswerStatus("correct");
      await updateProgress(tempFlashcards[currentIndex].unique_flashcard_id);
      await updatePetCurrency(5); // Will gonna add 5 pet currency for correct answer
      handleNextFlashcard();
    } else {
      setAttempts((prev) => prev - 1);
      setAnswerStatus("incorrect");
      incorrectAudio.play();

      if (attempts <= 1) {
        toast.error("No more attempts left. Moving to the next question.");
        handleNextFlashcard();
      } else {
        toast.warn("Incorrect answer. Try again.");
      }
    }
    setUserInput("");
  };

  const updateProgress = async (uniqueFlashcardId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `http://localhost:3002/cards/updateFlashcardProgress/${uniqueFlashcardId}`,
        { progress: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status !== 200) {
        console.error("Unexpected response status", response.status);
      }
    } catch (error) {
      console.error("Failed to update progress", error);
    }
  };

  const updatePetCurrency = async (amount: number) => {
    try {
      const token = localStorage.getItem("token");
      const pet_id = localStorage.getItem("pet_id");
      if (!token || !pet_id) throw new Error("No token or pet id found");

      const response = await axios.patch(
        `http://localhost:3002/pets/updatePetCurrency`,
        {
          pet_currency: amount,
          pet_id
         },
        { headers:
          {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200) {
        console.error("Unexpected response status", response.status);
      }
    } catch (error) {
      console.error("Failed to update pet currency", error);
    }
  };

  const currentFlashcard = tempFlashcards[currentIndex];
  const isQuizComplete = quizState === "finished";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
        `}
      </style>

      {quizState === "fillBlanks" ? (
        <div className="flex flex-col items-center  w-[100%]">
          <div
            className="w-[100%] max-w-[800px] h-[400px] -mt-[10rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center cursor-pointer"
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
          >
            <h2 className="text-3xl font-semibold text-[#354F52]">
              {currentFlashcard
                ? `Fill in the blank: ${currentFlashcard.question.replace(/___/g, "_____")}`
                : "Loading..."}
            </h2>
          </div>

          <button
               onClick={() => setQuizState("review")}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-white text-sm md:text-base lg:text-xl bg-[#354F52] p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-10 md:mr-20 mt-0 xl:mt-[2rem] z-10 absolute -right-9 lg:right-20  xl:right-[7rem] top-[4.5rem] lg:top-[6.5rem] transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
              >
                Review
            </button>

          <div className="mt-5 flex items-center space-x-2">
            <div
              className={`transition-transform ${
                answerStatus === "incorrect" ? "animate-shake" : ""
              }`}
            >
              <input
                type="text"
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheckAnswer()}
                placeholder="Your answer"
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className={`p-2 border rounded-md focus:outline-none transition-all duration-300 ${
                  answerStatus === "correct"
                    ? "focus:ring-2 focus:ring-green-500 focus:border-green-500 border-green-500 bg-green-50"
                    : answerStatus === "incorrect"
                    ? "focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-[#354F52] focus:border-[#354F52] border-[#354F52]"
                }`}
              />
            </div>
            <button
              onClick={handleCheckAnswer}
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="p-2 bg-[#354F52] text-white rounded-md"
            >
              Submit
            </button>
          </div>

          <div className="bg-[#354F52] rounded-lg p-2 mt-1.5 md:mt-[1.5rem]">
              <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl text-white font-medium mt-[2.5rem]">
                {currentIndex + 1} / {tempFlashcards.length}
              </span>
            </div>
        </div>
      ) : isQuizComplete ? (
        <div className="flex flex-col items-center">
          {/* Quiz Completion UI */}
          <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-5xl text-[#354F52] font-bold mb-4 -mt-[25rem]">
            FlashCard Complete! Well Done!
          </h2>
          <p
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="text-2xl text-[#354F52] mt-4"
            >
          Your Score: {userScore} / {tempFlashcards.length}
          </p>
          <button
            onClick={() => { shuffleFlashcards(); setQuizState("fillBlanks"); }}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-10 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            Shuffle & Restart
          </button>
          <button
            onClick={() => setOnFirstPage(true)}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-6 ml-[1rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
          >
            Go to Decks
          </button>
          <button
            onClick={handleStartNewQuiz}
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="text-white text-sm md:text-base xl:text-xl bg-[#354F52] p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-10 md:mr-20 mt-0 xl:mt-[2rem] z-10 absolute right-10 top-[8rem] xl:top-[16rem] shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        // Regular quiz UI before it's finished
        <div className="flex flex-col items-center w-[100%]">
          <button
               onClick={() => setQuizState("fillBlanks")}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-white text-md md:text-base lg:text-xl bg-[#354F52] md:p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-10 md:mr-20 mt-0 xl:mt-[2rem] z-10 absolute -right-9 lg:right-20  xl:right-[7rem] top-[4.5rem] lg:top-[6.5rem] transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
              >
                Start Quiz
            </button>
          <div
            className="w-[100%] max-w-[800px] h-[400px] -mt-[10rem] bg-white rounded-xl shadow-xl flex items-center justify-center text-center cursor-pointer"
            style={{
              fontFamily: '"Signika Negative", sans-serif',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
            onClick={() => setShowAnswer((prev) => !prev)}
          >
            {!showAnswer && (
              <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 text-lg">
                Tap to Reveal
              </div>
            )}
            <h2
              className="text-3xl font-semibold text-[#354F52] break-words max-w-full p-5"
              style={{
              fontFamily: '"Signika Negative", sans-serif',
              backfaceVisibility: 'hidden',
              transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {currentFlashcard ? (showAnswer ? currentFlashcard.answer : currentFlashcard.question) : "Loading..."}
            </h2>
          </div>

           {/* Navigation Controls */}
           <div className="flex items-center justify-between w-[250px] md:w-[600px] mt-5">
            <button
              onClick={handlePreviousFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-175 active:scale-50 mt-[1rem]"
              disabled={currentIndex === 0}
            >
              <CircleArrowLeft className="w-10 h-10 text-[#354F52]" />
            </button>
            <div className="bg-[#354F52] rounded-lg p-2 mt-[1.5rem]">
              <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl text-white font-medium mt-[2.5rem]">
                {currentIndex + 1} / {tempFlashcards.length}
              </span>
            </div>
            <button
              onClick={handleNextFlashcard}
              className="scale-150 cursor-pointer transition-transform duration-300 hover:scale-200 active:scale-50 mt-[1rem]"
            >
              <CircleArrowRight className="w-10 h-10 text-[#354F52]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};