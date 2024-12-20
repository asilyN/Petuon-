import { useState } from 'react';
import { useFlashcardHooks } from "../../hooks/UseFlashcard";
import { CreateFlashcard } from "./createflashcard";
import { QuizFlashcard } from "./quizPage";
import { Minus, FilePenLine, FolderMinus } from "lucide-react";
import { Flashcard } from "../../types/FlashCardTypes";
import axios from "axios";
import Modal from "../modal";



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
      await axios.put(`${import.meta.env.VITE_API_URL}/cards/updateFlashcard/${flashcardId}`, {
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


  const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
    return (
      <div
      className="-mt-[3rem] -mb-12 p-3 grid grid-cols-1 lg:grid-cols-2 gap-y-5 max-h-[260px] lg:max-h-[280px] xl:max-h-[248px] "
      id="flashcards-container"
    >
      {flashcards.map((flashcard, index) => (
        <div
          key={flashcard.unique_flashcard_id}
          style={{ fontFamily: '"Signika Negative", sans-serif' }}
          className="relative flex flex-col w-full sm:w-[40rem] lg:w-[98%] h-[15rem] md bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-100 mx-auto"
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
                    className="bg-white border-2 border-[#3498db] text-[#354F52] p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3498db] w-[100%] xl:w-[3/4]"
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

      const colors = [
        "bg-[#FE9B72]",
        "bg-[#FFC973]",
        "bg-[#E5EE91]",
        "bg-[#B692FE]",
      ];
 
  return (
    <>
    <div className='overflow-y-auto overflow-x-hidden h-[78%] scrollbar-hidden'>
    {onFirstPage ? (
        <div className=" flex flex-col items-center mt-[-5rem] mr-[6rem] scrollbar-hidden">
          <div className=" w-full mt-20 flex items-center ">
            <h1 className="text-[#354F52] font-serif text-3xl absolute top-[6rem] lg:top-[7rem]">Decks</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ fontFamily: '"Signika Negative", sans-serif' }}
              className="text-white text-sm md:text-base xl:text-xl mt-5 bg-[#354F52] p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-10 md:mr-20  xl:mt-[2rem] z-10 absolute -right-9 lg:right-20 xl:right-[5.5rem] top-[6rem] md:top-1/5 lg:top-[8rem] xl:top-[5.5rem] transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
            >
              Create Deck
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
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getDecks`, {
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
                  const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getDecks`, {
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
                className="flex items-center justify-right px-4 py-2  bg-[#354F52]  rounded transition-transform duration-200 hover:scale-105 hover:text-[#52796F] hover:bg-[#657F83] ]"
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
              className="flex items-center justify-right px-4 py-2  bg-[#354F52]  rounded transition-transform duration-200 hover:scale-105 hover:text-[#52796F] hover:bg-[#657F83] ]"
                >
                  <span style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-lg text-white font-semibold">Save</span>
            </button>
            </Modal>
          </div>
          <div className="w-[100vw] flex items-center justify-center relative md:ml-[2.5rem] xl:ml-0 mt-[-1.5rem] overflow-y-auto pt-0">
            <ul className="mt-24 w-full lg:w-[80%] xl:w-[90%] ml-[3rem] xl:ml-[7rem] pl-5 md:pr-10 lg:pr-5 xl:pr-10 md:pl-2 xl:pl-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-x-1 lg:gap-x-2 xl:gap-x-0 max-h-[540px] overflow-y-scroll overflow-x-hidden p-2 pb-14 [&::-webkit-scrollbar]:w-0">
             
              


              {/* Render Decks */}
              {!loadDecks && Object.keys(decks).length > 0 &&
                decks.map((deck, index) => {
                  const assignedColor = colors[index % colors.length];

                  return (
                    <li key={deck.title} className="md:w-full">
                      <div
                        onClick={() => {
                          loadDeck(deck.deck_id);
                        }}
                        className="shadow-lg rounded-3xl ml-5 h-[10rem] md:h-[14rem] w-[95%] lg:max-w-[18rem] xl:max-w-[20rem] flex flex-col justify-between cursor-pointer transform transition-transform duration-200 hover:scale-105 relative"
                      >
                        {/* Colored Strip */}
                        <div
                          className={`${assignedColor} rounded-t-3xl h-[1rem] w-full`}
                        ></div>

                        {/* Main Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white rounded-b-3xl">
                          <h1
                            className="text-2xl font-bold uppercase h-full w-full overflow-hidden text-ellipsis whitespace-nowrap"
                            style={{
                              fontFamily: '"Signika Negative", sans-serif',
                            }}
                          >
                            {deck.title}
                          </h1>
                          <button
                            className="absolute top-[.9rem] right-10 h-8 w-8 rounded-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditModalOpen(true);
                              setDeckId(deck.deck_id);
                            }}
                          >
                            <FilePenLine className="w-5 h-5 absolute top-2.5 transform text-black transition-transform duration-200 hover:scale-125" />
                          </button>
                          <button
                            className="absolute top-5 right-2 h-8 w-8 rounded-full flex items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDeck(deck.deck_id);
                            }}
                          >
                            <FolderMinus className="text-red-800 w-5.5 h-5.5 absolute transform transition-transform duration-200 hover:scale-125 hover:text-red-900" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="fixed top-[6rem] right-[3.9rem]">
          </div>
        </div>
      ) : isReviewing ? (
        <div>
          <div className="flex">
          <div className="flex items-center p- w-[13.5rem] h-[3rem] rounded-2xl">
          <div
              className="flex fixed items-center bg-[#354F52] text-white text-xl font-bold px-8 py-3 w-39 md:w-[15rem] xl:w-[20rem] h-10 xl:h-15 -ml-[3rem] lg:-m-[2rem] rounded-r-md shadow-lg"
              style={{
                fontFamily: '"Signika Negative", sans-serif',
                clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)",
              }}
            >
             
              <h1 className="ml-2 uppercase text-[18px]">
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
               className="text-white text-sm md:text-base lg:text-lg bg-[#354F52] xl:p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-[8rem] md:mr-[14rem] mt-0 xl:mt-[2rem] z-10 absolute -right-9 lg:right-20 xl:right-[10rem] top-[4.5rem] lg:top-[6.5rem] transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
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
        <div className='overflow-x-hidden'>
          <div className="flex">
          <div className="flex items-center w-[13.5rem] h-[3rem] rounded-2xl">
          <div className='bg-gray-100 lg:p-0 w-full h-16 flex z-10 fixed items-center m-0'>
          <div
              className="flex fixed items-center bg-[#354F52] text-white text-xl font-bold px-8 py-3 w-39 md:w-[15rem] xl:w-[20rem] h-10 xl:h-15 -ml-[3rem] lg:-m-[2rem] rounded-r-md shadow-lg"
              style={{
                fontFamily: '"Signika Negative", sans-serif',
                clipPath: "polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)",
              }}
            >
             
              <h1 className="ml-2 uppercase text-[18px]">
                {decks.find(deck => deck.deck_id === deckId)!.title?.length > 9
                  ? decks.find(deck => deck.deck_id === deckId)?.title.slice(0, 9) + "..."
                  : decks.find(deck => deck.deck_id === deckId)?.title || "Untitled"}
              </h1>
            </div>
          </div>
              <div>
                <button
                onClick={() => {setIsReviewing(true); setOnFirstPage(false);}}
                style={{ fontFamily: '"Signika Negative", sans-serif' }}
               className="text-white text-sm md:text-base xl:text-xl bg-[#354F52] p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-10 md:mr-20 mt-0 xl:mt-[2rem] z-10 absolute -right-9 lg:right-20  xl:right-[7rem] top-1/5 xl:top-[6.5rem] transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
                >
                Review Deck
                </button>
              </div>
              <div>
              <div>
              
               <button
                onClick={() => { setOnFirstPage(true); console.log("Clicked Review"); }}
                className="text-white text-base md:text-xl bg-[#354F52] p-4 w-[5rem] md:w-[8rem] xl:w-[10rem] h-[3rem] rounded-2xl mr-[8rem] md:mr-[14rem] mt-0 xl:mt-[2rem] z-10 absolute -right-9 lg:right-20 xl:right-[10rem] top-1/5 xl:top-[6.5rem] transform -translate-y-1/2 shadow-lg hover:bg-[#52796F] hover:scale-105 flex items-center justify-center"
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
    </div>
    </>
  );
};


export default FlashcardComponent;