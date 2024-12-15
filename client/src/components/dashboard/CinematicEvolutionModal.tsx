import React, { useEffect, useState } from "react";

interface CinematicEvolutionModalProps {
  pet: any;
  onClose: () => void;
}

const CinematicEvolutionModal: React.FC<CinematicEvolutionModalProps> = ({ pet, onClose }) => {
  const [showPet, setShowPet] = useState(false); // Controls visibility of the evolved pet
  const [fadeOutOldPet, setFadeOutOldPet] = useState(false); // Controls fading out the old pet
  const [showOldPet, setShowOldPet] = useState(false); // Controls visibility of the old pet (with delay)
  const [modalText, setModalText] = useState("Your pet is evolving..."); // Controls the displayed text

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOldPet(true); // Show the previous pet after 2 seconds
      setModalText("Your pet is evolving..."); // Update text when showing old pet
      setTimeout(() => {
        setFadeOutOldPet(true); // Start fading out old pet after it becomes visible
        setTimeout(() => {
          setShowPet(true); // Show evolved pet after old pet fades out
          setShowOldPet(false); // Remove old pet once evolved pet is shown
          setModalText("Your pet has evolved!"); // Update text when evolved pet is displayed
        }, 3000); // Wait for 3 seconds before starting the fade out animation
      }, 3000); // Wait for 3 seconds before starting the fade out animation
    }, 1000); // Initial delay of 2 seconds before showing the previous pet

    return () => clearTimeout(timer);
  }, []);

  const getEvolutionGif = (petType: string, evolutionRank: number): string => {
    if (evolutionRank === 1) {
      return `src/assets/pets/${petType}/evolution_1.png`;
    }
    return `src/assets/pets/${petType}/evolution_${evolutionRank}.gif`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96 h-96 flex flex-col justify-center items-center">
        {/* Updated text */}
        <h2 className="text-xl font-bold text-center mb-4">{modalText}</h2>
        <div className="flex justify-center mb-4">
          {/* Old Pet - Fading in after 2 seconds */}
          {showOldPet && (
            <img
              src={getEvolutionGif(pet.pet_type, pet.pet_evolution_rank - 1)} // Show previous evolution rank
              alt="Old Pet"
              className={`w-32 h-32 object-contain transition-opacity duration-3000 ${fadeOutOldPet ? "opacity-0" : "opacity-100"}`}
            />
          )}

          {/* New Evolved Pet - Fading in */}
          {showPet && (
            <img
              src={getEvolutionGif(pet.pet_type, pet.pet_evolution_rank)} // Evolved pet image
              alt="Evolved Pet"
              className="w-32 h-32 object-contain transition-opacity duration-3000 opacity-0 fade-in"
            />
          )}
        </div>
        {/* Conditionally render button after the evolved pet appears */}
        {showPet && (
          <button
            className="bg-primary-dark py-2 px-4 text-primary-500 rounded-xl w-full"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default CinematicEvolutionModal;
