import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProgressItem {
  title: string;
  time: string;
  progress: number; // Progress value (0 to 100)
}

const DeckProgress: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token");

  const fetchFlashcardsForDeck = async (deck_id: string) => {
   
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getFlashcards`, {
        params: { deck_id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const fetchDecks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getDecks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const decks = response.data;

      const deckPromises = decks.map(async (deck: { title: string; deck_id: string }) => {
        const flashcards = await fetchFlashcardsForDeck(deck.deck_id);
        const totalFlashcards = flashcards.length;
        const completedFlashcards = flashcards.filter((flashcard: any) => flashcard.progress === true).length;
        const progress = totalFlashcards > 0 ? (completedFlashcards / totalFlashcards) * 100 : 0;
        const time = new Date().toLocaleTimeString();

        return {
          title: deck.title,
          time: time,
          progress: Math.round(progress),
        };
      });

      const deckTitles = await Promise.all(deckPromises);

      let totalFlashcards = 0;
      let completedFlashcards = 0;

      for (const deck of decks) {
        const flashcards = await fetchFlashcardsForDeck(deck.deck_id);
        totalFlashcards += flashcards.length;
        completedFlashcards += flashcards.filter((flashcard: any) => flashcard.progress === true).length;
      }
      const overallProgress = totalFlashcards > 0 ? (completedFlashcards / totalFlashcards) * 100 : 0;

      setProgress(Math.round(overallProgress));
      setProgressItems(deckTitles);
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  return (
    <div className="rounded-lg p-4 w-full max-w">
      {/* Progress Header */}
      <h2 className="text-xl font-bold mb-4">Progress</h2>
  
      {/* Loading State */}
      {loading ? (
        <h1
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="mt-[3rem] text-center text-2xl text-gray-500 font-normal"
        >
          Fetching Deck Info...
        </h1>
      ) : progressItems.length === 0 ? ( // Check if no decks are added
        <h2
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="mt-[3rem] text-center text-2xl text-gray-500 font-normal"
        >
          No available decks 
        </h2>
      ) : (
        <>
          {/* Circular Progress */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative w-16 h-16">
              <svg
                className="transform -rotate-90"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
              >
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#185533"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <motion.span
                  className="text-xl font-bold text-[#185533]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {progress}%
                </motion.span>
              </div>
            </div>
          </div>
  
          {/* Progress List with Individual Progress Bars */}
          <div className="space-y-4">
            {progressItems.slice(0, 2).map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg p-3 mt-[-8.4rem] ml-[5rem] sm:ml-[7rem] scale-95 w-[12rem] sm:w-[25rem]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold">Deck: {item.title}</h3>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
  
                <div className="w-full mt-2">
                  <div className="h-2 bg-gray-300 rounded-full">
                    <motion.div
                      className="h-2 bg-[#185533] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    ></motion.div>
                  </div>
                  <motion.p
                    className="text-right text-xs mt-1 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    {item.progress}%
                  </motion.p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}  

export default DeckProgress;
