import {
  BookmarkMinus,
  CircleArrowLeft,
  CopyPlus,
  FolderPlus,
  Minus,
} from "lucide-react";
import SideBar from "../SideBar";
import WhiteContainer from "../WhiteContainer";
import React, { useState, useEffect } from "react";
import Avatar from "../Avatar";
import { Deck, Flashcard } from "../../types/FlashCardTypes";
import { QuizFlashcard } from "./quizPage";
import { CreateFlashcard } from "./createflashcard";
import axios from "axios";

const FlashcardComponent: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isReviewing, setisReviewing] = useState<boolean>(false);
  const [OnFirstPage, setOnFirstPage] = useState<boolean>(true);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [DeckTitle, setDeckTitle] = useState<string>("");

  const API_BASE_URL = "http://localhost:3002";

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/flashcards/decks`);
        setDecks(response.data);
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, []);

    const saveDeck = async () => {
    if (!DeckTitle.trim()) {
      alert("Deck title cannot be empty.");
      return;
    }
    if (flashcards.length === 0) {
      alert("You must add at least one flashcard before saving the deck.");
      return;
    }

    try {
      const { data: newDeck } = await axios.post(`${API_BASE_URL}/flashcards/decks`, {
        title: DeckTitle,
      });

      const flashcardsWithDeck = flashcards.map((card) => ({
        ...card,
        deck_id: newDeck.id,
      }));

      await axios.post(
        `${API_BASE_URL}/flashcards/decks/${newDeck.id}/flashcards`,
        { flashcards: flashcardsWithDeck }
      );

      const response = await axios.get(`${API_BASE_URL}/flashcards/decks`);
      setDecks(response.data);

      setDeckTitle("");
      setFlashcards([]);
    } catch (error) {
      console.error("Error saving deck:", error);
    }
  };

  const deleteFlashcard = async (index: number) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);

    // try {
    //   await axios.delete(
    //     `${API_BASE_URL}/flashcards/decks/${flashcards[index].id}`
    //   );
    // } catch (error) {
    //   console.error("Error deleting flashcard:", error);
    // }
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
                  onClick={() => deleteFlashcard(index)}
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

  const handleCreateNewDeck = () => {
    if (DeckTitle && flashcards.length > 0) {
      saveDeck();
    }
    setisReviewing(false);
    setOnFirstPage(false);
    setDeckTitle("");
    setFlashcards([]);
  };

  // Example frontend request
  const loadDeck = async (deckId: string) => {
    try {
        const response = await axios.get(`http://localhost:3002/decks/${deckId}`);
        // handle the response, which is the deck
        console.log('Deck loaded:', response.data);
    } catch (error) {
        console.error('Error loading deck:', error);
    }
};


  
  

  const deleteDeck = async (id: number) => {
    const updatedDecks = { ...decks };
    delete updatedDecks[id];
    setDecks(updatedDecks);
    window.location.reload();

    try {
      await axios.delete(`${API_BASE_URL}/flashcards/decks/${id}`);
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
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
          <h1 className="text-[#354F52] font-serif text-3xl m-10 mr-[77rem]">
            Saved Decks
          </h1>
          <div className="w-[94vw] flex items-center justify-center relative ml-[1.5rem] mt-[-1.5rem] ">
            <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-h-[540px] overflow-y-auto p-5 [&::-webkit-scrollbar]:w-2">
              {Object.keys(decks).length === 0 ? (
                <p
                  className="text-2xl text-gray-500 text-center col-span-full "
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  No decks saved yet. Create one to get started!
                </p>
              ) : (
                decks.map(({ title, id }, index) => {
                  const assignedColor = colors[index % colors.length];

                  return (
                    <li key={title} className="w-full">
                      <div
                        onClick={() => loadDeck(title)}
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
                          className="absolute bottom-3 right-3  h-8 w-8 rounded-full flex items-center justify-center "
                          onClick={(e) => {
                            e.preventDefault();
                            deleteDeck(id);
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
            <button
              onClick={handleCreateNewDeck}
              className=" scale-125 flex items-center justify-center"
            >
              <CopyPlus className="text-[#354F52] w-7 h-7 mt-[1rem] mr-[60rem] transform transition-transform duration-200 hover:scale-125" />
            </button>
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
              <input
                type="text"
                value={DeckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="h-16 m-5 rounded-3xl w-[30rem] p-5 shadow-lg mt-[1rem] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
                placeholder="Title"
              />
              <button onClick={saveDeck} className="flex  ">
                <FolderPlus className="w-10 h-10 ml-[1rem]  text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F] " />
              </button>
              <button
                onClick={() => setisReviewing(true)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="bg-[#657F83] text-white h-16 w-36 rounded-3xl m-10 shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110"
              >
                Start Learning!
              </button>
              <button
                onClick={() => setOnFirstPage(true)}
                className="text-4xl ml-[-0.5rem] text-center transform transition-transform duration-200 hover:scale-125"
              >
                <CircleArrowLeft className="w-10 h-10 text-[#657F83] hover:text-[#52796F]" />
              </button>
            </div>
          </div>
          <CreateFlashcard
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            deckId={null}
          />
          <FlashcardList flashcards={flashcards} />
        </div>
      )}
    </>
  );
};

const FlashCard = () => {
  return (
    <>
      <WhiteContainer>
        <h1
          style={{ fontFamily: '"Crimson Pro", serif' }}
          className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7"
        >
          FlashCards
        </h1>
        <FlashcardComponent />
        <Avatar />
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default FlashCard;
