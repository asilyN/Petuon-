import { BookmarkMinus, CircleArrowLeft, CircleArrowRight, CopyPlus,  FolderPlus, ListPlus, Minus, } from "lucide-react";
import SideBar from "./SideBar"
import WhiteContainer from "./WhiteContainer"
import React, { useState, useEffect } from 'react';
import Avatar from '../components/Avatar'

type Flashcard = {
    question: string;
    answer: string;
  };


type CreateFlashcardProps = {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
};

const CreateFlashcard: React.FC<CreateFlashcardProps> = ({ flashcards, setFlashcards }) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [flashcardCreated, setFlashcardCreated] = useState<boolean>(false);
  


  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
    setFlashcardCreated(false);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    setFlashcardCreated(false);
  };

  const createFlashcard = () => {
    if (question && answer) {
      const newFlashcard: Flashcard = { question, answer };
      const updatedFlashcards = [...flashcards, newFlashcard];
      setFlashcards(updatedFlashcards);
      localStorage.setItem("currentFlashcards", JSON.stringify(updatedFlashcards));
      setQuestion('');
      setAnswer('');
      setFlashcardCreated(true);
    } else {
      setFlashcardCreated(false);
    }
  };



  return (
    <div className="mt-[-2rem] flex flex-col md:flex-row justify-center items-center gap-10 p-4 ">
  <input
    type="text"
    value={question}
    onChange={handleQuestionChange}
    style={{ fontFamily: '"Signika Negative", sans-serif' }} 
    className="h-16 rounded-3xl w-full md:w-1/3 p-5 shadow-xl border-2 border-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent placeholder-gray-300 text-white bg-[#657F83] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
    placeholder="Insert question"
  />
  <input
    type="text"
    value={answer}
    onChange={handleAnswerChange}
    style={{ fontFamily: '"Signika Negative", sans-serif' }}
    className="h-16 rounded-3xl w-full md:w-1/3 p-5 shadow-xl border-2 border-[#52796F] focus:outline-none focus:ring-2 focus:ring-[#52796F] focus:border-transparent placeholder-gray-300 text-white bg-[#657F83] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
    placeholder="Insert answer"
  />
  <button
    onClick={createFlashcard}
    className="bg-[#657F83] text-white font-semibold h-16 w-16 shadow-xl rounded-full hover:bg-[#52796F] transition duration-200 hover:shadow-lg flex items-center justify-center transform hover:scale-110"
  >
    <ListPlus className="w-10 h-10 ml-2" />
  </button>
</div>


  );
};


  
  const FlashcardComponent: React.FC = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isReviewing, setisReviewing] = useState<boolean>(false);
    const [OnFirstPage, setOnFirstPage] = useState<boolean>(true)
    const [decks, setDecks] = useState<{ [key: string]: Flashcard[] }>({});
    const [DeckTitle, setDeckTitle] = useState<string>("");

    useEffect(() => {
      const storedDecks = localStorage.getItem("decks");
      const storedFlashcards = localStorage.getItem("currentFlashcards");
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks));
      }
      if (storedFlashcards) {
        setFlashcards(JSON.parse(storedFlashcards));
      }
    }, []);

    const saveDeck = () => {
      if (!DeckTitle.trim()) {
        alert("Deck title cannot be empty.");
        return;
      }
      if (flashcards.length === 0) {
        alert("You must add at least one flashcard before saving the deck.");
        return;
      }
    
      const updatedDecks = { ...decks, [DeckTitle]: flashcards };
    setDecks(updatedDecks);
    localStorage.setItem("decks", JSON.stringify(updatedDecks));

    setDeckTitle("");
    setFlashcards([]);
    localStorage.removeItem("currentFlashcards"); 
    setOnFirstPage(true);
  };
  const deleteFlashcard = (index: number) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
    localStorage.setItem("currentFlashcards", JSON.stringify(updatedFlashcards));
  };
  
  
    const FlashcardList: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
        return (
            <ul className="h-[70vh] mr-[7rem] -mt-[1rem] flex flex-col items-center overflow-y-auto p-0 [&::-webkit-scrollbar]:w-2 ">
            {flashcards.map((flashcard, index) => {
              const assignedColor = colors[index % colors.length];
              return (
              <li key={index} className="w-2/3 mt-10 ml-[7rem] m-[7rem] relative transform transition-transform duration-200 hover:scale-105">
                <div style={{fontFamily: '"Signika Negative", sans-serif' }} className={`${assignedColor} rounded-2xl h-[20rem] w-full flex flex-col items-center justify-center overflow-auto relative shadow-lg`}>
                <button
                  className="absolute top-4 right-4 flex items-center justify-center transform transition-transform duration-200 hover:scale-125"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlashcard(index);
                  }}
                >
                  <Minus className="text-red-500 mt-[-.5rem] w-8 h-8" />
                </button>
                <h1 className="text-5xl mb-5 break-words">{flashcard.question}</h1>
                <h2 className="text-xl">{flashcard.answer}</h2>
                </div>
              </li>
              );
            })}
            </ul>
        );
      };



      interface quizFlashcardProps {
        flashcards: Flashcard[];
      }
      
      const QuizFlashcard: React.FC<quizFlashcardProps> = ({ flashcards }) => {
        const [tempFlashcards, setTempFlashcards] = useState<Flashcard[]>([...flashcards]);
        const [currentIndex, setCurrentIndex] = useState<number>(0);
        const [showAnswer, setShowAnswer] = useState<boolean>(false);
        const [QuizFinished, setQuizFinished] = useState<boolean>(false);


        function shuffleArray<T>(array: T[]): T[] {
          const shuffled = [...array]; 
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
          }
          return shuffled;
        }

        const shuffleFlashcards = () => {
          const shuffled = shuffleArray(flashcards);
          setTempFlashcards(shuffled);
          setCurrentIndex(0); 
          setShowAnswer(false); 
        };
      
        useEffect(() => {
          const shuffledCards = shuffleArray(flashcards)
          setTempFlashcards(shuffledCards);
          setCurrentIndex(0);
          setShowAnswer(false);
        }, [flashcards]);
      
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
              <div className=" mb-8">
                <div className="w-[80rem] h-[300px] bg-black rounded-2xl shadow-lg overflow-hidden ml-[-8rem] ">
                    <div
                    className="bg-[#FE9B72] w-full h-full p-5 text-center cursor-pointer flex flex-col justify-center items-center"
                    onClick={() => setShowAnswer((prev) => !prev)}
                    >
                    <h2 style={{fontFamily: '"Signika Negative", sans-serif' }} className="text-4xl mb-5">{currentFlashcard.question}</h2>
                    <p style={{fontFamily: '"Signika Negative", sans-serif' }} className={`text-xl ${showAnswer ? "text-black" : "text-gray-200"}`}> 
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
                    className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]" //1234
                    >
                    <CircleArrowRight className="w-[3.5rem] h-[3.5rem] text-[#354F52]" />
                    </button>
                </div>
              </div>
              
              <div className="flex flex-col  ml-[21rem] mt-[-5rem]">
                <p style={{fontFamily: '"Signika Negative", sans-serif' }} className="text-4xl">Quiz complete! Well done!</p>
                <button
                  onClick={shuffleFlashcards}
                  style={{fontFamily: '"Signika Negative", sans-serif' }} className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-5 ml-[7rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
                >
                  Shuffle & Restart
                </button>
                <button
                  onClick={() => setOnFirstPage(true)}
                  style={{fontFamily: '"Signika Negative", sans-serif' }} className="bg-[#354F52] text-white h-10 w-36 rounded-full mt-5 ml-[7rem] transform transition-transform duration-200 hover:scale-125 hover:text-white"
                >
                  Go to Flashcards
                </button>
              </div>
            </div>
            
            ) : (
              <div className="w-[80%] h-[450px] ml-[-8rem] flex flex-col items-center justify-center rounded-2xl ">
                <div
                  className="bg-[#FE9B72] rounded-2xl p-5 w-full text-center cursor-pointer flex flex-col justify-center items-center h-full shadow-lg"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  <h2 style={{fontFamily: '"Signika Negative", sans-serif' }} className="text-6xl mb-5">{currentFlashcard.question}</h2>
                  <p style={{fontFamily: '"Signika Negative", sans-serif' }} className={`text-3xl ${showAnswer ? "text-black" : "text-gray-400"}`}>
                    {showAnswer ? currentFlashcard.answer : "Tap to show answer"}
                  </p>
                </div>
                <div className="flex justify-between mt-5 w-full">
                <button
                    onClick={handleNextFlashcard}
                    className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
                    >
                    <CircleArrowLeft className="w-[3.5rem] h-[3.5rem] text-[#354F52]" />
                    </button>
                  <button
                    onClick={handleNextFlashcard}
                    className="rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125 hover:text-[#52796F]"
                    >
                    <CircleArrowRight className="w-[3.5rem] h-[3.5rem] text-[#354F52] " />
                    </button>
                </div>
              </div>
            )}
          </div>
        );
      };
      

      const handleCreateNewDeck = () => {
        if (DeckTitle && flashcards.length > 0) {
          saveDeck(); 
        }
        setisReviewing(false);
        setOnFirstPage(false);
        localStorage.removeItem("currentFlashcards");
        setDeckTitle(""); 
        setFlashcards([]); 
      };

      const loadDeck = (title: string) => {
        const selectedDeck = decks[title];
        setFlashcards(selectedDeck || []);
        setDeckTitle(title);
        localStorage.setItem("currentFlashcards", JSON.stringify(selectedDeck || []));
        setOnFirstPage(false);
      };

      const deleteDeck = (title: string) => {
        const updatedDecks = { ...decks };
        delete updatedDecks[title];
        setDecks(updatedDecks);
        localStorage.setItem("decks", JSON.stringify(updatedDecks));
      };

      const colors = ["bg-[#FE9B72]", "bg-[#FFC973]", "bg-[#E5EE91]", "bg-[#B692FE]"];
    
      return (
        <>
          {OnFirstPage ? (
            <div className="flex flex-col items-center mt-[-3rem] mr-[6rem] ">
              <h1
                className="text-[#354F52] font-serif text-3xl m-10 mr-[71rem]"
                
              >
                SavedDecks
              </h1>
              <div className="w-[94vw] flex items-center justify-center relative ml-[9rem] mt-[-1.5rem] ">
              <ul className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-h-[540px] overflow-y-auto p-5 [&::-webkit-scrollbar]:w-2">
                  {Object.keys(decks).length === 0 ? (
                    <p
                      className="text-2xl text-gray-500 text-center col-span-full "
                      style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    >
                      No decks saved yet. Create one to get started!
                    </p>
                  ) : (
                    Object.keys(decks).map((title, index) => {
                      const assignedColor = colors[index % colors.length];
    
                      return (
                        <li key={title} className="w-full">
                          <div
                            onClick={() => loadDeck(title)}
                            className={`${assignedColor} shadow-lg rounded-3xl h-[15rem] w-[18rem] p-4 flex flex-col justify-between cursor-pointer transform transition-transform duration-200 hover:scale-105 relative`}
                          >
                            <h1
                              className="text-2xl font-bold uppercase text-center flex items-center justify-center h-full w-full overflow-hidden text-ellipsis whitespace-nowrap"
                              style={{ fontFamily: '"Signika Negative", sans-serif' }}
                            >
                              {title}
                            </h1>
                            <button
                              className="absolute bottom-3 right-3  h-8 w-8 rounded-full flex items-center justify-center "
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDeck(title);
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
                  <CopyPlus className="text-[#354F52] w-7 h-7 mt-[1rem] mr-[61.8rem] transform transition-transform duration-200 hover:scale-125" />
                </button>
              </div>
            </div>
          ) : isReviewing ? (
            <div>
              <div className="flex">
                <h1 className="ml-[2.1rem] mt-[-0.5rem] font-serif text-3xl m-10 text-[#354F52]">Review</h1>
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
                <QuizFlashcard flashcards={flashcards} />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex">
                <h1 className="ml-[2.1rem] mt-[-0.5rem] font-serif text-3xl m-10 text-[#354F52]">Create Flashcards!</h1>
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    value={DeckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}  
                    className="h-16 m-5 rounded-3xl w-[30rem] p-5 shadow-lg mt-[1rem] transform transition-transform duration-200 hover:scale-105 focus:scale-105"
                    placeholder="Title"
                  />
                    <button
                    onClick={saveDeck}
                    className="flex  "
                    >
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
              <CreateFlashcard flashcards={flashcards} setFlashcards={setFlashcards} />
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
          <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 mt-7">FlashCards</h1>
            <FlashcardComponent />
            <Avatar/>
          </WhiteContainer>
          <SideBar />
        </>
      );
    };
    
    export default FlashCard;