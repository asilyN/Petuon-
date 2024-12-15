import React from "react";
import { useFlashcardHooks } from "../../hooks/UseFlashcard";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";
import { FolderPlus, BookmarkMinus, Minus, CircleArrowLeft } from "lucide-react";
import { Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';


const token = localStorage.getItem('token');

const FlashcardComponent: React.FC = () => {
  const {
    flashcards,
    decks,
    isReviewing,
    onFirstPage,
    deckTitle,
    deckId,
    setFlashcards,
    setDeckTitle,
    setDecks,
    setIsReviewing,
    setOnFirstPage,
    saveDeck,
    loadDeck,
    deleteDeck,
    deleteFlashcard,
  } = useFlashcardHooks();


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
              className="w-2/3 ml-[9rem] m-10 relative transform transition-transform duration-200 hover:scale-105"
            >
              <div
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className={`${assignedColor} rounded-2xl h-[15rem] w-full flex flex-col items-center justify-center overflow-auto relative shadow-lg`}
              >
                <button
                  className="absolute top-4 right-4 flex items-center justify-center transform transition-transform duration-200 hover:scale-125"
                  onClick={() => {
                    if (flashcard.unique_flashcard_id) {
                      deleteFlashcard(flashcard.unique_flashcard_id); 
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
      {onFirstPage ? (
        <div className="flex flex-col items-center mt-[-3rem] mr-[6rem] ">
          <div className=" h-24 w-full mt-20 flex items-center ">
          <h1 className="text-[#354F52] font-serif text-3xl ">
            Create a new Deck
          </h1>
            <input
                  type="text"
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await saveDeck();
                    const response = await axios.get(`http://localhost:3002/cards/getDecks`, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                    });
                    const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
                    deck_id: deck.deck_id,
                    title: deck.title,
                    }));
                    setDecks(deckData);
                  }
                  }}
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="h-16 m-5 rounded-3xl w-[30rem] p-5 shadow-lg mt-[1rem] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
                  placeholder="Title"
                />
                <button
                onClick={async () => {
                  await saveDeck();
                  const response = await axios.get(`http://localhost:3002/cards/getDecks`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                  });
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
            Decks
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
          </div>
        </div>
      ) : isReviewing ? (
        <div>
          <div className="flex">
            <h1 className="ml-[2.1rem] mt-[-0.5rem] mr-5 font-serif text-3xl m-10 text-[#354F52]">
              Reviewing: 
            </h1>
            <h1 className=" mt-[-0.5rem] mr-20 font-serif text-2xl text-black font-bold uppercase">
              {decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
            </h1>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setIsReviewing(false)}
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
            <div className="flex justify-center items-center">
                <h1 className="ml-[2.1rem] mt-[-0.5rem] mr-0 font-serif text-2xl text-[#354F52] font-bold uppercase">
                Deck:
                </h1>
                <h1 className="ml-5 mt-[-0.5rem] mr-96 font-serif text-2xl text-black font-bold uppercase">
                {decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
                </h1>
              <button
                onClick={() => {setIsReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="bg-[#657F83] text-white h-16 w-36 rounded-3xl m-10 ml-72 shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110"
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
          {flashcards.length > 0 ? (
            <FlashcardList flashcards={flashcards} />
          ) : (
            <p className="text-2xl text-gray-500 text-center mt-10" style={{ fontFamily: '"Signika Negative", sans-serif' }}>
              No flashcards available. Create one to get started!
            </p>
          )}
        </div>
      )}
    </>
  );
};


export default FlashcardComponent;