import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import BG from "../assets/BG.png";

const getRandomColor = () => {
    const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const FlashCard: React.FC = () => {
    const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
    const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null);
    const [newSetTitle, setNewSetTitle] = useState("");
    const [newSetDescription, setNewSetDescription] = useState("");
    const [newTerm, setNewTerm] = useState("");
    const [newDefinition, setNewDefinition] = useState("");
    const [isReviewing, setIsReviewing] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [editCardIndex, setEditCardIndex] = useState<number | null>(null);

    useEffect(() => {
        const savedFlashcardSets = localStorage.getItem("flashcardSets");
        if (savedFlashcardSets) {
            setFlashcardSets(JSON.parse(savedFlashcardSets));
        }
    }, []);

    useEffect(() => {
        if (flashcardSets.length > 0) {
            localStorage.setItem("flashcardSets", JSON.stringify(flashcardSets));
        }
    }, [flashcardSets]);

    const addFlashcardSet = () => {
        if (newSetTitle && newSetDescription) {
            const newSet: FlashcardSet = {
                title: newSetTitle,
                description: newSetDescription,
                cards: [],
                progress: 0
            };
            const updatedSets = [...flashcardSets, newSet];
            setFlashcardSets(updatedSets);
            setNewSetTitle("");
            setNewSetDescription("");
            setCurrentSetIndex(updatedSets.length - 1);
        }
    };

    const addFlashcard = () => {
        if (newTerm && newDefinition && currentSetIndex !== null) {
            const updatedSets = [...flashcardSets];
            if (editCardIndex !== null) {
                updatedSets[currentSetIndex].cards[editCardIndex] = { term: newTerm, definition: newDefinition };
                setEditCardIndex(null);
            } else {
                updatedSets[currentSetIndex].cards.push({ term: newTerm, definition: newDefinition });
            }
            setFlashcardSets(updatedSets);
            setNewTerm("");
            setNewDefinition("");
        }
    };

    const updateProgress = () => {
        if (currentSetIndex !== null) {
            const currentSet = flashcardSets[currentSetIndex];
            const newProgress = currentSet.cards.length > 0 
                ? ((currentCardIndex + 1) / currentSet.cards.length) * 100 
                : 0;
            const updatedSets = [...flashcardSets];
            updatedSets[currentSetIndex].progress = newProgress;
            setFlashcardSets(updatedSets);
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((currentCardIndex + 1) % flashcardSets[currentSetIndex].cards.length);
        updateProgress();
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((currentCardIndex - 1 + flashcardSets[currentSetIndex].cards.length) % flashcardSets[currentSetIndex].cards.length);
        updateProgress();
    };

    const goBackToMain = () => {
        setCurrentSetIndex(null);
        setIsReviewing(false);
        setCurrentCardIndex(0);
    };

    const deleteFlashcardSet = (index: number) => {
        const updatedSets = flashcardSets.filter((_, i) => i !== index);
        setFlashcardSets(updatedSets);
    };

    const deleteFlashcard = (cardIndex: number) => {
        if (currentSetIndex !== null) {
            const updatedSets = [...flashcardSets];
            updatedSets[currentSetIndex].cards = updatedSets[currentSetIndex].cards.filter((_, i) => i !== cardIndex);
            setFlashcardSets(updatedSets);
        }
    };

    return (
        <div
            className="flex gap-2 lg:gap-4 justify-start"
            style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            <Sidebar />

            <div
                className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col overflow-hidden"
                style={{
                    backgroundColor: "#F6F6F6",
                    marginLeft: "-10px",
                    position: "relative",
                    overflowY: "auto",
                }}
            >
                <h1 className="text-2xl font-bold mb-4">FlashCard</h1>

                {currentSetIndex === null ? (
                    <div>
                        {/* Create New Flashcard Set Section */}
                        <h3 className="text-xl font-semibold mb-2">Create a New Flashcard Set</h3>
                        <input
                            className="w-full p-2 my-2 border rounded"
                            placeholder="Title..."
                            value={newSetTitle}
                            onChange={(e) => setNewSetTitle(e.target.value)}
                        />
                        <input
                            className="w-full p-2 my-2 border rounded"
                            placeholder="Description..."
                            value={newSetDescription}
                            onChange={(e) => setNewSetDescription(e.target.value)}
                        />
                        <button
                            className="w-full p-2 bg-blue-500 text-white rounded"
                            onClick={addFlashcardSet}
                        >
                            Create Set
                        </button>

                        {/* Existing Flashcard Sets Section */}
                        <h2 className="text-xl font-semibold mb-2 mt-6">Flashcard Sets</h2>
                        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-auto">
                            {flashcardSets.map((set, index) => (
                                <div
                                    key={index}
                                    className="relative p-4 bg-white shadow-lg rounded-lg overflow-hidden"
                                    style={{
                                        width: "250px",
                                        height: "220px", // Reduced height
                                        backgroundColor: getRandomColor(), // Random color
                                    }}
                                >
                                    <button
                                        onClick={() => deleteFlashcardSet(index)}
                                        className="absolute top-2 right-2 text-red-500"
                                    >
                                        &times;
                                    </button>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => setCurrentSetIndex(index)}
                                    >
                                        <p className="font-bold text-lg">{set.title}</p>
                                        <p className="text-sm">{set.description}</p>
                                        <p className="text-sm">Progress: {Math.round(set.progress)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : !isReviewing ? (
                    <div>
                        <button onClick={goBackToMain} className="mb-4 p-2 bg-gray-500 text-white rounded">Back</button>
                        <h2 className="text-xl font-semibold">{flashcardSets[currentSetIndex].title}</h2>
                        <p>{flashcardSets[currentSetIndex].description}</p>

                        {/* Flashcard Adding Form */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Add New Flashcards</h3>
                            {flashcardSets[currentSetIndex].cards.map((card, index) => (
                                <div key={index} className="p-2 my-2 border rounded">
                                    <p><strong>Term:</strong> {card.term}</p>
                                    <p><strong>Definition:</strong> {card.definition}</p>
                                    <button onClick={() => { setNewTerm(card.term); setNewDefinition(card.definition); setEditCardIndex(index); }} className="mr-2 text-blue-500">Edit</button>
                                    <button onClick={() => deleteFlashcard(index)} className="text-red-500">Delete</button>
                                </div>
                            ))}

                            <div className="flex gap-2">
                                <input
                                    className="flex-1 p-2 border rounded"
                                    placeholder="Term..."
                                    value={newTerm}
                                    onChange={(e) => setNewTerm(e.target.value)}
                                />
                                <input
                                    className="flex-1 p-2 border rounded"
                                    placeholder="Definition..."
                                    value={newDefinition}
                                    onChange={(e) => setNewDefinition(e.target.value)}
                                />
                            </div>
                            <button
                                className="w-full p-2 bg-blue-500 text-white rounded"
                                onClick={addFlashcard}
                            >
                                {editCardIndex !== null ? "Save Changes" : "Add Card"}
                            </button>
                        </div>

                        <button
                            className="w-full mt-4 p-2 bg-green-500 text-white rounded"
                            onClick={() => setIsReviewing(true)}
                        >
                            Start Reviewing
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full">
                        <button onClick={goBackToMain} className="mb-4 p-2 bg-gray-500 text-white rounded">Back</button>

                        {/* Flashcard Display */}
                        <div
                            className="p-8 w-96 h-56 bg-white shadow-md rounded-lg flex items-center justify-center transform transition-all hover:scale-105 cursor-pointer"
                            onClick={() => setIsFlipped(!isFlipped)}
                            style={{ height: '230px', width: '250px' }} 
                        >
                            <h3 className="text-3xl font-semibold text-center">
                                {isFlipped 
                                    ? flashcardSets[currentSetIndex].cards[currentCardIndex].definition 
                                    : flashcardSets[currentSetIndex].cards[currentCardIndex].term
                                }
                            </h3>
                        </div>

                        <div className="mt-4 flex justify-between w-96">
                            <button onClick={prevCard} className="p-2 bg-gray-500 text-white rounded w-24">Previous</button>
                            <button onClick={() => { goBackToMain(); }} className="p-2 bg-red-500 text-white rounded w-24">Stop</button>
                            <button onClick={nextCard} className="p-2 bg-gray-500 text-white rounded w-24">Next</button>
                        </div>

                        <div className="mt-4 text-center w-96">
                            <p>Progress: {Math.round(flashcardSets[currentSetIndex].progress)}%</p>
                            <p>Card {currentCardIndex + 1} of {flashcardSets[currentSetIndex].cards.length}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlashCard;
