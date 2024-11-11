// FlashCard.tsx
import React from "react";
import Sidebar from './Sidebar';  // Import Sidebar component
import BG from "../assets/BG.png";  // Importing the background image

const FlashCard: React.FC = () => {
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
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Container */}
            <div
                className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col"
                style={{
                    backgroundColor: "#F6F6F6",
                    marginLeft: "-10px", // Adjust this value to move the main content to the left
                }}
            >
                <h1 className="text-2xl font-bold mb-4">FlashCard</h1>
                {/* Add your FlashCard content here */}
            </div>
        </div>
    );
}

export default FlashCard;
