import React, { useState } from "react";
import { useFlashcardHooks } from "../../hooks/UseFlashcard";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";
import { FolderPlus, BookmarkMinus, Minus, FilePenLine } from "lucide-react";
import { Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";
import Modal from "../modal";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const token = localStorage.getItem('token');

const FlashcardComponent: React.FC = () => {
  const {
    loadDecks,
    loadCards,
    flashcards,
    decks,
    isReviewing,
    onFirstPage,
    deckTitle,
    deckId,
    isModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    setIsModalOpen,
    setFlashcards,
    setDeckTitle,
    setDecks,
    setIsReviewing,
    setOnFirstPage,
    saveDeck,
    loadDeck,
    deleteDeck,
    deleteFlashcard,
    setDeckId,
    handleUpdateDeckTitle
  } = useFlashcardHooks();

  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);

  const handleEditQuestion = (flashcardId: string) => {
    setEditingQuestion(flashcardId);
  };

  const handleEditAnswer = (flashcardId: string) => {
    setEditingAnswer(flashcardId);
  };

  const handleSaveQuestion = (flashcardId: string, newQuestion: string) => {
    updateFlashcard(flashcardId, newQuestion, "question");
    setEditingQuestion(null);
  };

  const handleSaveAnswer = (flashcardId: string, newAnswer: string) => {
    updateFlashcard(flashcardId, newAnswer, "answer");
    setEditingAnswer(null);
  };

  const updateFlashcard = async (flashcardId: string, newValue: string, field: "question" | "answer") => {
    try {
      // API call to update the flashcard
      await axios.put(`http://localhost:3002/cards/updateFlashcard/${flashcardId}`, {
        [field]: newValue,
      });

      // Optimistically update the flashcards state to reflect the change
      setFlashcards(prevFlashcards => 
        prevFlashcards.map(flashcard => 
          flashcard.unique_flashcard_id === flashcardId
            ? { ...flashcard, [field]: newValue } // Update the modified field
            : flashcard
        )
      );

      console.log(`${field} updated successfully!`);
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, flashcardId: string, newValue: string, field: "question" | "answer") => {
    if (e.key === 'Enter') {
      if (field === "question") {
        handleSaveQuestion(flashcardId, newValue);
      } else if (field === "answer") {
        handleSaveAnswer(flashcardId, newValue);
      }
    }
  };

  const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
    return (
      <div className="-mt-[2.5rem] p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-5 max-h-[250px] overflow-x-auto scrollbar-thin ">
        {flashcards.map((flashcard) => (
          <div
            key={flashcard.unique_flashcard_id}
            className="relative flex flex-col w-[40rem] h-[10rem] bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-100 transition mx-auto"
          >
            {/* Question Card */}
            <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="mb-4 text-center">
              {editingQuestion === flashcard.unique_flashcard_id ? (
                <input
                  type="text"
                  defaultValue={flashcard.question}
                  onBlur={(e) => handleSaveQuestion(flashcard.unique_flashcard_id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, flashcard.unique_flashcard_id, e.currentTarget.value, "question")}
                  className="w-full p-2 border rounded-lg"
                  autoFocus
                />
              ) : (
                <p
                  className="font-semibold text-[#354F52] break-words cursor-pointer"
                  onClick={() => handleEditQuestion(flashcard.unique_flashcard_id)}
                >
                  {flashcard.question}
                </p>
              )}
            </div>

            {/* Answer Card (Hidden by default) */}
            <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="mt-4 text-center text-[#52796F]">
              {editingAnswer === flashcard.unique_flashcard_id ? (
                <textarea
                  defaultValue={flashcard.answer}
                  onBlur={(e) => handleSaveAnswer(flashcard.unique_flashcard_id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, flashcard.unique_flashcard_id, e.currentTarget.value, "answer")}
                  className="w-full p-2 border rounded-lg"
                  autoFocus
                  aria-label="Edit answer"
                />
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => handleEditAnswer(flashcard.unique_flashcard_id)}
                >
                  {flashcard.answer}
                </p>
              )}
            </div>

            {/* Delete Button */}
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

    </div>
  ))}
</div>

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
     <ToastContainer />
     {onFirstPage ? (
        <div className="flex flex-col items-center mt-[-3rem] mr-[6rem] ">
          <div className=" h-24 w-full mt-20 flex items-center ">
            <h1 className="text-[#354F52] font-serif text-3xl ">Decks</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-10"
            >
              Create Deck
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 className="text-2xl font-bold mb-4">Create a New Deck</h2>
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
                    setDeckTitle(''); // Clear input field
                  }
                }}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Enter deck title"
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
                  setDeckTitle(''); // Clear input field
                  setIsModalOpen(false);
                }}
                className="flex"
              >
                <FolderPlus className="w-10 h-10 ml-[1rem] text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" />
              </button>
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <h2 className="text-2xl font-bold mb-4">Edit Deck Title</h2>
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    // Update deck title and refresh deck list
                    await handleUpdateDeckTitle();
                    setDeckTitle(''); // Clear input field
                  }
                }}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Enter new deck title"
              />
              <button
                onClick={async () => {
                  // Update deck title and refresh deck list
                  await handleUpdateDeckTitle();
                  setDeckTitle(''); // Clear input field
                }}
                className="flex"
              >
                <FolderPlus className="w-10 h-10 ml-[1rem] text-[#354F52] transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" />
              </button>
            </Modal>
          </div>
          <div className="w-[94vw] flex items-center justify-center relative ml-[1.5rem] mt-[-1.5rem] ">
            <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ml-7 max-h-[540px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2">
              {/* Loading State */}
                {loadDecks ? (
                  <p className="text-2xl text-gray-500 text-center col-span-full">
                    Fetching cards...
                  </p>
                ) : Object.keys(decks).length === 0 ? (
                  <p
                    className="text-2xl text-gray-500 text-center col-span-full"
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  >
                    No decks saved yet. Create one to get started!
                  </p>
                ) : null}

                {/* Render Decks */}
                {!loadDecks && Object.keys(decks).length > 0 && (
                  decks.map((deck, index) => {
                    const assignedColor = colors[index % colors.length];

                    return (
                      <li key={deck.title} className="w-full ml-[3rem]">
                        <div
                          onClick={() => { loadDeck(deck.deck_id); }}
                          className={`${assignedColor} shadow-lg rounded-3xl h-[15rem] w-[18rem] p-4 flex flex-col justify-between cursor-pointer transform transition-transform duration-200 hover:scale-105 relative`}
                        >
                          <h1
                            className="text-2xl font-bold uppercase text-center flex items-center justify-center h-full w-full overflow-hidden text-ellipsis whitespace-nowrap"
                            style={{
                              fontFamily: '"Signika Negative", sans-serif',
                            }}
                          >
                            {deck.title}
                          </h1>
                          <button
                            className="absolute top-3 right-12 h-8 w-8 rounded-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditModalOpen(true);
                              setDeckId(deck.deck_id);
                            }}
                          >
                            <FilePenLine className="w-5 h-5 transform transition-transform duration-200 hover:scale-125" />
                          </button>
                          <button
                            className="absolute bottom-3 right-3 h-8 w-8 rounded-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDeck(deck.deck_id);
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
          <div className="flex items-center bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-2xl">
                <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="-ml-[0.1rem] mt-[0.2rem]  text-xl text-white  uppercase">
                Deck:
                </h1>
                <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="ml-1 mt-[0.2rem] mr-96 font-serif text-xl text-white  uppercase">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9 
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
              </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setIsReviewing(false)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-white text-2xl bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-2xl m-10 mt-[4rem] -ml-[13.5rem] shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110 flex items-center justify-center"
                >
                Return to deck
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
          <div className="flex items-center bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-2xl">
                <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="-ml-[0.1rem] mt-[0.2rem]  text-xl text-white  uppercase">
                Deck:
                </h1>
                <h1 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="ml-1 mt-[0.2rem] mr-96 font-serif text-xl text-white  uppercase">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9 
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
              <div>
                <button
                onClick={() => {setIsReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
                className="text-white text-2xl bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-2xl m-10 mt-[10rem] -ml-[33.95rem] shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110 flex items-center justify-center"
                >
                Review Deck
                </button>
              </div>
              <div>
              <button
                onClick={() => {setOnFirstPage(true); console.log("Clicked Review");}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-white text-2xl bg-[#354F52] p-4 w-[13.5rem] h-[3rem] rounded-2xl m-10 mt-[17.5rem] -ml-[33.95rem] shadow-lg transform transition-transform duration-200 hover:bg-[#52796F] hover:scale-110 flex items-center justify-center"
                >
                Back
              </button>
              </div>
            </div>
          </div>
          <CreateFlashcard
            flashcards={flashcards}
            setFlashcards={setFlashcards}
            flashCardId={deckId}          
          />
         {loadCards ? (
            <p className="text-2xl text-gray-500 text-center mt-10" style={{ fontFamily: '"Signika Negative", sans-serif' }}>
              Fetching flashcards...
            </p>
          ) : flashcards.length > 0 ? (
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