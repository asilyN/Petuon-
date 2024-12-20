import React, { useEffect, useState } from "react";

// Import pet evolution images and GIFs
import evolution1Capybara from '../../assets/pets/capybara/evolution_1.png';
import evolution2Capybara from '../../assets/pets/capybara/evolution_2.gif';
import evolution3Capybara from '../../assets/pets/capybara/evolution_3.gif';
import evolution4Capybara from '../../assets/pets/capybara/evolution_4.gif';

import evolution1Cat from '../../assets/pets/cat/evolution_1.png';
import evolution2Cat from '../../assets/pets/cat/evolution_2.gif';
import evolution3Cat from '../../assets/pets/cat/evolution_3.gif';
import evolution4Cat from '../../assets/pets/cat/evolution_4.gif';

import evolution1Dinosaur from '../../assets/pets/dinosaur/evolution_1.png';
import evolution2Dinosaur from '../../assets/pets/dinosaur/evolution_2.gif';
import evolution3Dinosaur from '../../assets/pets/dinosaur/evolution_3.gif';
import evolution4Dinosaur from '../../assets/pets/dinosaur/evolution_4.gif';

import evolution1Duck from '../../assets/pets/duck/evolution_1.png';
import evolution2Duck from '../../assets/pets/duck/evolution_2.gif';
import evolution3Duck from '../../assets/pets/duck/evolution_3.gif';
import evolution4Duck from '../../assets/pets/duck/evolution_4.gif';

import evolution1Penguin from '../../assets/pets/penguin/evolution_1.png';
import evolution2Penguin from '../../assets/pets/penguin/evolution_2.gif';
import evolution3Penguin from '../../assets/pets/penguin/evolution_3.gif';
import evolution4Penguin from '../../assets/pets/penguin/evolution_4.gif';

import evolution1Unicorn from '../../assets/pets/unicorn/evolution_1.png';
import evolution2Unicorn from '../../assets/pets/unicorn/evolution_2.gif';
import evolution3Unicorn from '../../assets/pets/unicorn/evolution_3.gif';
import evolution4Unicorn from '../../assets/pets/unicorn/evolution_4.gif';

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

  // Function to return the appropriate evolution image/GIF based on pet type and evolution rank
  const getEvolutionGif = (petType: string, evolutionRank: number): string => {
    switch (petType) {
      case 'capybara':
        if (evolutionRank === 1) return evolution1Capybara;
        if (evolutionRank === 2) return evolution2Capybara;
        if (evolutionRank === 3) return evolution3Capybara;
        return evolution4Capybara;
      case 'cat':
        if (evolutionRank === 1) return evolution1Cat;
        if (evolutionRank === 2) return evolution2Cat;
        if (evolutionRank === 3) return evolution3Cat;
        return evolution4Cat;
      case 'dinosaur':
        if (evolutionRank === 1) return evolution1Dinosaur;
        if (evolutionRank === 2) return evolution2Dinosaur;
        if (evolutionRank === 3) return evolution3Dinosaur;
        return evolution4Dinosaur;
      case 'duck':
        if (evolutionRank === 1) return evolution1Duck;
        if (evolutionRank === 2) return evolution2Duck;
        if (evolutionRank === 3) return evolution3Duck;
        return evolution4Duck;
      case 'penguin':
        if (evolutionRank === 1) return evolution1Penguin;
        if (evolutionRank === 2) return evolution2Penguin;
        if (evolutionRank === 3) return evolution3Penguin;
        return evolution4Penguin;
      case 'unicorn':
        if (evolutionRank === 1) return evolution1Unicorn;
        if (evolutionRank === 2) return evolution2Unicorn;
        if (evolutionRank === 3) return evolution3Unicorn;
        return evolution4Unicorn;
      default:
        return '';
    }
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
