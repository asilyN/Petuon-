import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import BG from "../assets/BG.png";

const StudyFlashCard: React.FC = () => {
    const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        // Load flashcards from localStorage if available
        const storedCards = localStorage.getItem("flashcards");
        if (storedCards) {
            setFlashcards(JSON.parse(storedCards));
        }
    }, []);

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setIsFlipped(false);
    };

    const handlePreviousCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setIsFlipped(false);
    };

    const currentCard = flashcards[currentCardIndex];

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
                className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col"
                style={{
                    backgroundColor: "#F6F6F6",
                    marginLeft: "-10px",
                }}
            >
                <h1 className="text-2xl font-bold mb-4">Study Flashcards</h1>

                <div className="flex justify-center items-center" style={{ height: "80vh" }}>
                    <div
                        className="w-64 h-48 flex items-center justify-center rounded-lg shadow-lg cursor-pointer"
                        style={{
                            backgroundColor: "#ffffff",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                            transition: "transform 0.5s",
                        }}
                        onClick={handleCardClick}
                    >
                        {isFlipped ? (
                            <div className="text-xl text-center">{currentCard?.answer}</div>
                        ) : (
                            <div className="text-xl text-center">{currentCard?.question}</div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        onClick={handlePreviousCard}
                        disabled={flashcards.length === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        onClick={handleNextCard}
                        disabled={flashcards.length === 0}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyFlashCard;
