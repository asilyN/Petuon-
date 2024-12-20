import { useState } from 'react';
import { useFlashcardHooks } from "../../hooks/UseFlashcard";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";
import { Minus, FilePenLine, ChevronRight, ChevronLeft } from "lucide-react";
import { Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";
import Modal from "../modal";

import sleepingPenguin from "../../assets/sleeping_penguin2.gif"

const token = localStorage.getItem('token');
const pet_id = localStorage.getItem('pet_id');

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
  const [selectedDeck, setSelectedDeck] = useState<{ deck_id: string; title: string } | null>(null);

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleDecksCount = 3; // Define the number of decks to be visible at a time
  const [highlightIndex, setHighlightIndex] = useState(0); // Define highlightIndex state

  const totalGroups = Math.ceil(decks.length / visibleDecksCount); // Total number of groups

  // Get the current set of visible decks based on the `currentIndex` and `visibleDecksCount`
  const getVisibleDecks = () => {
    return decks.slice(currentIndex, currentIndex + visibleDecksCount);
  };


  // Update the highlighted deck within the current group
  const handlePrev = () => {
    if (highlightIndex > 0) {
      setHighlightIndex(prevIndex => prevIndex - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - visibleDecksCount);
      setHighlightIndex(visibleDecksCount - 1);  // Go to the last deck in the previous set
    }
  };

  const handleNext = () => {
    if (highlightIndex < getVisibleDecks().length - 1) {
      setHighlightIndex(prevIndex => prevIndex + 1);
    } else if (currentIndex + visibleDecksCount < decks.length) {
      setCurrentIndex(prevIndex => prevIndex + visibleDecksCount);
      setHighlightIndex(0);  // Reset to the first deck in the next set
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index * visibleDecksCount);  // Clicking a dot will take you to the first deck in that group
    setHighlightIndex(0);  // Highlight the first deck in the new set
  };


  // Handle selecting a deck (Open the deck in the middle)
  const handleSelect = (deck: { deck_id: string; title: string }) => {
    loadDeck(deck.deck_id);
    setSelectedDeck(deck); // Optionally store the selected deck for further use (e.g., open it in a modal)
  };
  

  const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
    return (
      <div
      className="-mt-[3rem] p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-5 max-h-[260px] overflow-x-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-500"
      id="flashcards-container"
    >
      {flashcards.map((flashcard, index) => (
        <div
          key={flashcard.unique_flashcard_id}
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="relative flex flex-col w-full sm:w-[40rem] h-[15rem] md bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-100 mx-auto"
        >
          {/* Top Colored Section */}
          <div className="bg-[#354F52] h-[20%] w-full rounded-t-2xl  flex items-center justify-between px-4 relative">
            {/* Flashcard Index */}
            <span className="text-white text-lg font-semibold">{index + 1}</span>
    
            {/* Delete Button */}
            <button
              className="flex items-center justify-center transform transition-transform duration-200 hover:scale-125"
              onClick={() => {
                if (flashcard.unique_flashcard_id) {
                  deleteFlashcard(flashcard.unique_flashcard_id);
                } else {
                  console.error("Flashcard unique_flashcard_id is undefined");
                }
              }}
            >
              <Minus className="text-red-500 w-8 h-8" />
            </button>
          </div>
    
          {/* Main Content */}
          <div className="flex flex-col w-full items-start p-4 -mt-1 gap-4">
              {/* Question Field */}
              <div className="flex flex-col w-full">
                <label className="text-[#354F52] text-sm ml-1 mb-1">Question</label>
                {editingQuestion === flashcard.unique_flashcard_id ? (
                  <input
                    type="text"
                    className="bg-white border-2 border-[#3498db] text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    defaultValue={flashcard.question}
                    onBlur={(e) => handleSaveQuestion(flashcard.unique_flashcard_id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveQuestion(flashcard.unique_flashcard_id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    className="bg-gray-200 text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] cursor-pointer"
                    value={flashcard.question}
                    onClick={() => handleEditQuestion(flashcard.unique_flashcard_id)}
                    readOnly
                  />
                )}
              </div>

              {/* Answer Field */}
              <div className="flex flex-col w-full">
                <label className="text-[#354F52] text-sm ml-1 mb-1">Answer</label>
                {editingAnswer === flashcard.unique_flashcard_id ? (
                  <input
                    type="text"
                    className="bg-white border-2 border-[#3498db] text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    defaultValue={flashcard.answer}
                    onBlur={(e) => handleSaveAnswer(flashcard.unique_flashcard_id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveAnswer(flashcard.unique_flashcard_id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    className="bg-gray-200 text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] cursor-pointer"
                    value={flashcard.answer}
                    onClick={() => handleEditAnswer(flashcard.unique_flashcard_id)}
                    readOnly
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
        );
      };
 
  return (
    <>
     {onFirstPage ? (
        <div className="flex flex-col items-center mt-[-3rem] mr-[7rem] ">
          <div className=" h-24 w-full mt-20 flex items-center "> 
            <h1 style={{ fontFamily: '"Signika Negative", sans-serif'}} className="text-[#354F52] ml-[3.5rem] text-5xl absolute left-1/3 transform -translate-x-1/4 -mt-[8rem]">Decks of Flash Cards</h1>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute right-[11rem] top-[6.5rem] flex items-center justify-center w-[10rem] h-[3rem] rounded-xl bg-[#354F52] hover:bg-[#52796F] transition duration-300"
              >
                {/* Text */}
                <span
                  className="text-white font-semibold"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  Create Deck
                </span>
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl font-bold mb-4">Create a New Deck</h2>
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
                className="w-full p-2 border border-[#354F52] rounded-md mb-4 focus:border-[#354F52]"
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
                className="flex items-center justify-center px-4 py-2 ml-[15.7rem]  bg-[#354F52]  rounded transition-transform duration-200 hover:scale-105 hover:text-[#52796F] hover:bg-[#657F83] ]"
                >
                  <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg text-white font-semibold">Create</span>
                </button>
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
              <h2 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl font-semibold mb-4">Edit Deck Title</h2>
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
               className="w-full p-2 border border-[#354F52] rounded-md mb-4 focus:border-[#354F52]"
                placeholder="Enter new deck title"
              />
              <button
              onClick={async () => {
                // Update deck title and refresh deck list
                await handleUpdateDeckTitle();
                setDeckTitle(''); // Clear input field
              }}
              className="flex items-center justify-center px-4 py-2 ml-[16.7rem]  bg-[#354F52]  rounded transition-transform duration-200 hover:scale-105 hover:text-[#52796F] hover:bg-[#657F83] ]"
                >
                  <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg text-white font-semibold">Save</span>
            </button>
            </Modal>
          </div>
            {/* Added flashcard */}
            <div className="relative w-full flex items-center justify-center flex-col">

            {loadDecks && (
                <h1
                  className="mt-[-1.5rem] text-[1.5rem] text-gray-500 font-normal"
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                >
                  Fetching Decks...
                </h1>
              )}
              
              {decks.length === 0 && !loadDecks ? (
                <div className="flex flex-col items-center mt-4 ml-[3rem]">
                  <img
                    src={sleepingPenguin}
                    alt="No decks available"
                    className="h-[15rem] w-[15rem]"
                  />
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="-mt-5 text-2xl text-gray-500"
                  >
                    No Decks Available
                  </p>
                </div>
            ) : (
              <>
                {/* Visible Decks */}
                <ul className="flex items-center justify-center transition-all duration-700 ease-in-out -mt-8 ml-[5rem]">
                  {getVisibleDecks().map((deck, index) => {
                    const isHighlighted = highlightIndex === index;  // Check if the deck is currently highlighted
                    let scaleClass = isHighlighted ? "scale-110 opacity-100" : "scale-90 opacity-60";
                    let zIndexClass = isHighlighted ? "z-20" : "z-10";
                    let bgColorClass = isHighlighted ? "bg-[#4F6F72]" : "bg-[#A4B7B5]";

                    return (
                      <li key={deck.deck_id} className="w-[350px] flex-shrink-0 relative transition-all ease-in-out duration-500">
                        <div
                          onClick={() => handleSelect(deck)} // Select deck when clicked
                          className={`shadow-lg rounded-3xl w-[290px] h-[350px] cursor-pointer transition-all transform ${scaleClass} ${zIndexClass} relative hover:opacity-100 hover:shadow-xl ease-in-out duration-300`}
                        >
                          {/* Edit and Delete buttons */}
                          <div className="absolute top-2 right-2 flex space-x-2 z-20">
                            {/* Edit Button */}
                            <button
                              className="h-8 w-8 rounded-full flex items-center justify-center bg-white p-1 shadow-md hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditModalOpen(true);
                                setDeckId(deck.deck_id);
                              }}
                            >
                              <FilePenLine className="w-5 h-5 text-[#354F52]" />
                            </button>

                            {/* Delete Button */}
                            <button
                              className="h-8 w-8 rounded-full flex items-center justify-center bg-white p-1 shadow-md hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDeck(deck.deck_id);
                              }}
                            >
                              <Minus className="w-5 h-5 text-red-800" />
                            </button>
                          </div>

                          {/* Top Colored Section */}
                          <div
                            className={`h-[30%] rounded-t-3xl transition-all ease-in-out ${bgColorClass}`}
                          ></div>

                          {/* Bottom White Section */}
                          <div className="h-[65%] bg-white rounded-b-3xl p-4 flex justify-center items-center">
                            <h1 className="text-xl text-[#354F52] font-bold uppercase text-center" style={{ fontFamily: '"Signika Negative", sans-serif' }}>
                              {deck.title.length > 17 ? deck.title.slice(0, 17) + "..." : deck.title}
                            </h1>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {/* Navigation Buttons Below */}
                <div className="mt-12 flex justify-center items-center space-x-5 ml-[3.5rem]">
                  {/* Left Button */}
                  {!loadDecks && decks.length > 0 && (
                  <button
                    onClick={handlePrev}
                    className={`text-[#354F52] hover:text-gray-500 p-4 transition-all duration-300 transform hover:scale-125 ${currentIndex === 0 && highlightIndex === 0 ? '' : ''}`}
                    disabled={currentIndex === 0 && highlightIndex === 0}
                  >
                    <ChevronLeft size={40} />
                  </button>
                  )}
                 
                    {/* Select Button */}
                    <div style={{ fontFamily: '"Signika Negative", sans-serif' }} className="flex justify-center">
                      {decks.length > 0 && (
                      <button
                        onClick={() => handleSelect(getVisibleDecks()[highlightIndex])}
                        className="px-10 py-3 text-white bg-[#354F52] rounded-full transition-all duration-300 transform hover:scale-110"
                      >
                        {getVisibleDecks()[highlightIndex].title.length > 8
                        ? getVisibleDecks()[highlightIndex].title.slice(0, 8).toUpperCase() + "..."
                        : getVisibleDecks()[highlightIndex].title.toUpperCase()}
                      </button>
                      )}
                    </div>

                  {/* Right Button */}
                  {!loadDecks && decks.length > 0 && (
                  <button
                    onClick={handleNext}
                    className={`text-[#354F52] hover:text-gray-500 p-4 transition-all duration-300 transform hover:scale-125 ${currentIndex + visibleDecksCount >= decks.length && highlightIndex === visibleDecksCount - 1 ? '' : ''}`}
                    disabled={currentIndex + visibleDecksCount >= decks.length && highlightIndex === visibleDecksCount - 1}
                  >
                    <ChevronRight size={40} />
                  </button>
                  )}
                </div>
                    
                  {/* Dots Navigation */}
                  <div className="-mt-[2] flex space-x-2 ml-[3rem]">
                    {Array.from({ length: totalGroups }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full ${currentIndex === index * visibleDecksCount ? 'bg-[#354F52]' : 'bg-gray-600'} transition-all duration-300`}
                      ></button>
                    ))}
                  </div>
            </>
          )}
        </div>
        </div>
      ) : isReviewing ? (
        <div>
          <div className="flex">
          <div className="flex items-center p-4 w-[13.5rem] h-[3rem] rounded-2xl">
          <div
              className="flex items-center bg-[#354F52] text-white text-xl font-bold px-8 py-3 w-[20em] -ml-[3rem] rounded-r-md shadow-lg"
              style={{
                fontFamily: '"Signika Negative", sans-serif',
                clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)",
              }}
            >
              
              <h1 className="ml-2 uppercase">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
            </div>
              </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setIsReviewing(false)}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
               className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[2rem] absolute left-0 top-1/4 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
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
          <div className="flex items-center p-4 w-[13.5rem] h-[3rem] rounded-2xl">
          <div
              className="flex items-center bg-[#354F52] text-white text-xl font-bold px-8 py-3 w-[20rem] -ml-[3rem] rounded-r-md shadow-lg"
              style={{
                fontFamily: '"Signika Negative", sans-serif',
                clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)",
              }}
            >
             
              <h1 className="ml-2 uppercase">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
            </div>
              <div>
                <button
                onClick={() => {setIsReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
               className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[2rem] absolute left-0 top-1/4 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
                >
                Review Deck
                </button>
              </div>
              <div>
              <div>
              
               <button
                onClick={() => { setOnFirstPage(true); console.log("Clicked Review"); }}
                className="text-white text-xl bg-[#354F52] p-4 w-[10rem] h-[3rem] rounded-2xl m-10 mt-[2rem] absolute left-0 top-1/3 transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
              >
                Back
              </button>
                </div>
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

