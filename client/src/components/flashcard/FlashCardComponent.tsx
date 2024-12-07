import { BookmarkMinus, CircleArrowLeft, FolderPlus, Minus} from "lucide-react";
import React, { useState, useEffect } from "react";
// import SideBar from "../SideBar";
// import WhiteContainer from "../WhiteContainer";
// import Avatar from "../Avatar";

import { Deck, Flashcard } from "../../types/FlashCardTypes";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";


const FlashcardComponent: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);

  const [isReviewing, setisReviewing] = useState<boolean>(false);
  const [OnFirstPage, setOnFirstPage] = useState<boolean>(true);
 
  const [DeckTitle, setDeckTitle] = useState<string>("");
  const [deckId, setDeckId] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/cards/getDecks`);
        const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
          deck_id: deck.deck_id,
          title: deck.title,
        }));
        setDecks(deckData)
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/cards/getFlashcards`);
        const flashcardData = response.data.map((flashcard: { question: string; answer: string; flashcard_id: string;  unique_flashcard_id: string}) => ({
          question: flashcard.question,
          answer: flashcard.answer,
          flashcard_id: flashcard.flashcard_id,
          unique_flashcard_id: flashcard.unique_flashcard_id,
        }));
        setFlashcards(flashcardData)
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    }
    fetchDecks(); 
    fetchFlashcards();
  }, []);

  useEffect(() => {
    if (deckId) {
      console.log(`Updated deckId: ${deckId}`);
    }
  }, [deckId]);


  const saveDeck = async () => {
    if (!DeckTitle.trim()) {
      alert("Deck title cannot be empty.");
      return;
    }
    try {
      setOnFirstPage(true)
      const data: Deck = {
        title: DeckTitle,
        deck_id: uuidv4(),
      };
      await axios.post(`http://localhost:3002/cards/insertDecks`, data)
      setDeckTitle("");
      alert("Deck saved successfully!");
    } catch (error) {
      console.error("Error saving deck:", error);

    }
  };

  // const handleCreateNewDeck = () => {
  //   if (DeckTitle) {
  //     saveDeck();
  //   }
  //   setisReviewing(false);
  //   setOnFirstPage(false);
  //   setDeckTitle("");
  //   setFlashcards([]);
  // };

  const loadDeck = async (deck_id: string) => {
    try {
      setDeckId(deck_id);
      setisReviewing(false);
      setOnFirstPage(false);
  
      // Fetch flashcards specific to the selected deck
      const response = await axios.get(`http://localhost:3002/cards/getFlashcards`, {
        params: { deck_id },
      });
  
      const flashcardData = response.data.map((flashcard: { question: string; answer: string; flashcard_id: string; unique_flashcard_id: string }) => ({
        question: flashcard.question,
        answer: flashcard.answer,
        flashcard_id: flashcard.flashcard_id,
        unique_flashcard_id: flashcard.unique_flashcard_id,
      }));
  
      setFlashcards(flashcardData); // Update state with new flashcards
    } catch (error) {
      console.error("Error loading deck:", error);
      setFlashcards([]); // Reset flashcards if loading fails
    }
  };
  
  
  const deleteDeck = async (deckId: string) => {
    try {
      await axios.delete(`http://localhost:3002/cards/deleteDeck/${deckId}`);
      const updatedDecks = decks.filter(deck => deck.deck_id !== deckId);
      setDecks(updatedDecks);
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };
  

  const deleteFlashcard = async (unique_flashcard_id: string) => {
    try {
      await axios.delete(`http://localhost:3002/cards/deleteFlashcard/${unique_flashcard_id}`);
      setFlashcards(flashcards.filter(flashcard => flashcard.unique_flashcard_id !== unique_flashcard_id));
      console.log("Flashcard deleted successfully!");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({
    flashcards,
  }) => {
    return (
      <ul className="h-[70vh] mr-[7rem] mt-[-1rem] flex flex-col items-center overflow-y-auto p-0 ">
        {flashcards.map((flashcard, index) => {
          const assignedColor = colors[index % colors.length];
          return (
            <li
              key={index}
              className="w-2/3 mt-10 ml-[9rem] m-[7rem] relative transform transition-transform duration-200 hover:scale-105"
            >
              <div
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className={`${assignedColor} rounded-2xl h-[20rem] w-full flex flex-col items-center justify-center overflow-auto relative shadow-lg`}
              >
                <button
                  className="absolute top-4 right-4 flex items-center justify-center transform transition-transform duration-200 hover:scale-125"
                  onClick={() => {
                    if (flashcard.unique_flashcard_id) {
                      deleteFlashcard(flashcard.unique_flashcard_id); // Check that unique_flashcard_id is not undefined
                    } else {
                      console.error("Flashcard unique_flashcard_id is undefined");
                    }
                  }}
                >
                  <Minus className="text-red-500 mt-[-.5rem] w-8 h-8" />
                </button>
                <h1 className="text-5xl mb-5 break-words">
                  {flashcard.question}
                </h1>
                <h2 className="text-xl">{flashcard.answer}</h2>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };
  const colors = [
    "bg-[#FE9B72]",
    "bg-[#FFC973]",
    "bg-[#E5EE91]",
    "bg-[#B692FE]",
  ];
  return (
    <>
      {OnFirstPage ? (
        <div className="flex flex-col items-center mt-[-3rem] mr-[6rem] ">
          <div className=" h-24 w-full mt-20 flex items-center ">
          <h1 className="text-[#354F52] font-serif text-3xl ">
            Create a new Deck
          </h1>
            <input
                type="text"
                value={DeckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="h-16 m-5 rounded-3xl w-[30rem] p-5 shadow-lg mt-[1rem] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
                placeholder="Title"
              />
                <button
                onClick={async () => {
                  await saveDeck();
                  const response = await axios.get(`http://localhost:3002/cards/getDecks`);
                  const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
                  deck_id: deck.deck_id,
                  title: deck.title,
                  }));
                  setDecks(deckData);
                }}
                className="flex"
                >
                <FolderPlus className="w-10 h-10 ml-[1rem] text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" />
                </button>
          </div>
          <h1 className="text-[#354F52] font-serif text-3xl m-10 mt-1 mr-[70rem]">
            SavedDecks
          </h1>
          <div className="w-[94vw] flex items-center justify-center relative ml-[1.5rem] mt-[-1.5rem] ">
            <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ml-7 max-h-[540px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2">
              {Object.keys(decks).length === 0 ? (
                <p
                  className="text-2xl text-gray-500 text-center col-span-full "
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  No decks saved yet. Create one to get started!
                </p>
              ) : (
                decks.map(({ title, deck_id}, index) => {
                  const assignedColor = colors[index % colors.length];

                  return (
                    <li key={title} className="w-full ml-[3rem]">
                      <div
                        onClick={() => {loadDeck(deck_id)}}
                        className={`${assignedColor} shadow-lg rounded-3xl h-[15rem] w-[18rem] p-4 flex flex-col justify-between cursor-pointer transform transition-transform duration-200 hover:scale-105 relative`}
                      >
                        <h1
                          className="text-2xl font-bold uppercase text-center flex items-center justify-center h-full w-full overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{
                            fontFamily: '"Signika Negative", sans-serif',
                          }}
                        >
                          {title}
                        </h1>
                        <button
                          className="absolute bottom-3 right-3 h-8 w-8 rounded-full flex items-center justify-center"
                          onClick={(e) => {
                          e.stopPropagation();
                          deleteDeck(deck_id);
                          }}
                        >
                          <BookmarkMinus className="text-red-800 w-5 h-5 mb-[23rem] transform transition-transform duration-200 hover:scale-125 hover:text-red-900" />
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <div className="fixed top-[6rem] right-[3.9rem]">
            {/* <button
              onClick={handleCreateNewDeck}
              className=" scale-125 flex items-center justify-center"
            >
              <CopyPlus className="text-[#354F52] w-7 h-7 mt-[1rem] mr-[60rem] transform transition-transform duration-200 hover:scale-125" />
            </button> */}
          </div>
        </div>
      ) : isReviewing ? (
        <div>
          <div className="flex">
            <h1 className="ml-[2.1rem] mt-[-0.5rem] font-serif text-3xl m-10 text-[#354F52]">
              Review
            </h1>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setisReviewing(false)}
                className="flex mt-[-2.8rem] ml-[-2.8rem]"
              >
                <FolderPlus className="w-10 h-10 ml-[1rem]  text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F] " />
              </button>
            </div>
          </div>
          <div className="b">
            <QuizFlashcard
              flashcards={flashcards}
              setOnFirstPage={setOnFirstPage}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex">
            <h1 className="ml-[2.1rem] mt-[-0.5rem] font-serif text-3xl m-10 text-[#354F52]">
              Create Flashcards!
            </h1>
            <div className="flex justify-center items-center">
              <button
                onClick={() => {setisReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="bg-[#657F83] text-white h-16 w-36 rounded-3xl m-10 shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110"
              >
                Review Deck
              </button>
              <button
                onClick={() => {setOnFirstPage(true); console.log("Clicked Review");}}
                className="text-4xl ml-[-0.5rem] text-center transform transition-transform duration-200 hover:scale-125"
              >
                <CircleArrowLeft className="w-10 h-10 text-[#657F83] hover:text-[#52796F]" />
              </button>
            </div>
          </div>
          <CreateFlashcard
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            flashCardId={deckId}          
          />
          <FlashcardList flashcards={flashcards} />
        </div>
      )}
    </>
  );
};


export default FlashcardComponent;
