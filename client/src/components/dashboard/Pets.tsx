import { useState, useEffect } from "react";
import { usePets } from "../../hooks/usePets"; // Import your custom hook for fetching pets
import PetSelectionModal from "./PetSelectionModal";
import CareMessageModal from "./CareMessageModal"; // Import the CareMessageModal component
import CinematicEvolutionModal from "./CinematicEvolutionModal"; // Import the new modal component
import axios from "axios";

// Import pet images dynamically
import capybaraEvol1 from '../../assets/pets/capybara/evolution_1.png';
import capybaraEvol2 from '../../assets/pets/capybara/evolution_2.gif';
import capybaraEvol3 from '../../assets/pets/capybara/evolution_3.gif';
import capybaraEvol4 from '../../assets/pets/capybara/evolution_4.gif';

import catEvol1 from '../../assets/pets/cat/evolution_1.png';
import catEvol2 from '../../assets/pets/cat/evolution_2.gif';
import catEvol3 from '../../assets/pets/cat/evolution_3.gif';
import catEvol4 from '../../assets/pets/cat/evolution_4.gif';

import dinosaurEvol1 from '../../assets/pets/dinosaur/evolution_1.png';
import dinosaurEvol2 from '../../assets/pets/dinosaur/evolution_2.gif';
import dinosaurEvol3 from '../../assets/pets/dinosaur/evolution_3.gif';
import dinosaurEvol4 from '../../assets/pets/dinosaur/evolution_4.gif';

import duckEvol1 from '../../assets/pets/duck/evolution_1.png';
import duckEvol2 from '../../assets/pets/duck/evolution_2.gif';
import duckEvol3 from '../../assets/pets/duck/evolution_3.gif';
import duckEvol4 from '../../assets/pets/duck/evolution_4.gif';

import penguinEvol1 from '../../assets/pets/penguin/evolution_1.png';
import penguinEvol2 from '../../assets/pets/penguin/evolution_2.gif';
import penguinEvol3 from '../../assets/pets/penguin/evolution_3.gif';
import penguinEvol4 from '../../assets/pets/penguin/evolution_4.gif';

import unicornEvol1 from '../../assets/pets/unicorn/evolution_1.png';
import unicornEvol2 from '../../assets/pets/unicorn/evolution_2.gif';
import unicornEvol3 from '../../assets/pets/unicorn/evolution_3.gif';
import unicornEvol4 from '../../assets/pets/unicorn/evolution_4.gif';

// Import the eating GIFs for evolution ranks 2-4
import capybaraEvol2Eating from '../../assets/pets/capybara/evolution_2_eating.gif';
import capybaraEvol3Eating from '../../assets/pets/capybara/evolution_3_eating.gif';
import capybaraEvol4Eating from '../../assets/pets/capybara/evolution_4_eating.gif';

import catEvol2Eating from '../../assets/pets/cat/evolution_2_eating.gif';
import catEvol3Eating from '../../assets/pets/cat/evolution_3_eating.gif';
import catEvol4Eating from '../../assets/pets/cat/evolution_4_eating.gif';

import dinosaurEvol2Eating from '../../assets/pets/dinosaur/evolution_2_eating.gif';
import dinosaurEvol3Eating from '../../assets/pets/dinosaur/evolution_3_eating.gif';
import dinosaurEvol4Eating from '../../assets/pets/dinosaur/evolution_4_eating.gif';

import duckEvol2Eating from '../../assets/pets/duck/evolution_2_eating.gif';
import duckEvol3Eating from '../../assets/pets/duck/evolution_3_eating.gif';
import duckEvol4Eating from '../../assets/pets/duck/evolution_4_eating.gif';

import penguinEvol2Eating from '../../assets/pets/penguin/evolution_2_eating.gif';
import penguinEvol3Eating from '../../assets/pets/penguin/evolution_3_eating.gif';
import penguinEvol4Eating from '../../assets/pets/penguin/evolution_4_eating.gif';

import unicornEvol2Eating from '../../assets/pets/unicorn/evolution_2_eating.gif';
import unicornEvol3Eating from '../../assets/pets/unicorn/evolution_3_eating.gif';
import unicornEvol4Eating from '../../assets/pets/unicorn/evolution_4_eating.gif';

//background
import beachBackground from '../../assets/backgrounds/beach_background.gif'
import hillBackground from '../../assets/backgrounds/hill_background.gif'
import spaceBackground from '../../assets/backgrounds/space_background.gif'
import claimBackground from '../../assets/backgrounds/claimed_background.png'

//icons
import currencyIcon from '../../assets/currency.png'





const token = localStorage.getItem("token");

interface PetsProps {
  onPetAdded: (pet: any) => void;
  onPetUpdated: (updatedPet: any) => void;
}

const Pets: React.FC<PetsProps> = ({ onPetAdded, onPetUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCareMessageModal, setShowCareMessageModal] = useState(false);
  const [showEvolutionCinematic, setShowEvolutionCinematic] = useState(false); // New state for evolution cinematic
  const [tempGif, setTempGif] = useState<string | null>(null); // State for temporary GIF display
  const [isFeeding, setIsFeeding] = useState(false); // State for button cooldown
  const { pets, loading, error, fetchPets, setPets } = usePets();
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const backgrounds = [beachBackground, hillBackground, spaceBackground];


  useEffect(() => {
    fetchPets();
  }, []);

  const handleClaimPet = () => {
    setShowModal(true);
  };

  // Function to change the background
const changeBackground = (direction: "left" | "right") => {
  setBackgroundIndex((prevIndex) =>
    direction === "left"
      ? (prevIndex - 1 + backgrounds.length) % backgrounds.length
      : (prevIndex + 1) % backgrounds.length
  );
};

const handleFeedPet = async (petData: any) => {
  if (isFeeding) {
    return; // Prevent feeding if cooldown is active
  }

  if (petData.pet_currency >= 100) {
    setIsFeeding(true); // Start cooldown

    const updatedPet = { ...petData };

    if (updatedPet.pet_evolution_rank >= 4) {
      alert("Your pet has reached its final evolution rank! It cannot be fed anymore.");
      setIsFeeding(false); // Reset cooldown
      return;
    }

    if (updatedPet.pet_evolution_rank > 1) {
      // Only show eating GIF if the evolution rank is greater than 1
      const eatingGif = getEatingGif(updatedPet.pet_type, updatedPet.pet_evolution_rank);
      setTempGif(eatingGif);

      setTimeout(() => {
        setTempGif(null);
      }, 2000); // Reset to original GIF after 2 seconds
    }

    if (updatedPet.pet_progress_bar >= 100) {
      updatedPet.pet_progress_bar = 0; // Reset progress bar
      updatedPet.pet_evolution_rank += 1; // Update evolution rank here
      
      // Increase max value required to fill the progress bar by 50 after each evolution
      updatedPet.pet_max_value += 50;

      setShowEvolutionCinematic(true); // Trigger evolution cinematic
    } else {
      updatedPet.pet_currency -= 100;
      updatedPet.pet_progress_bar = Math.min(updatedPet.pet_progress_bar + 10, 100);
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/pets/updatePet/${updatedPet.pet_id}`,
        {
          pet_currency: updatedPet.pet_currency,
          pet_progress_bar: updatedPet.pet_progress_bar,
          pet_evolution_rank: updatedPet.pet_evolution_rank,
          pet_max_value: updatedPet.pet_max_value, // Update the max value
          updated_date: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPets((prevPets) =>
        prevPets.map((pet) => (pet.pet_id === updatedPet.pet_id ? updatedPet : pet))
      );

      onPetUpdated(updatedPet);
    } catch (error) {
      console.error("Error updating pet data:", error);
    } finally {
      setTimeout(() => {
        setIsFeeding(false); // End cooldown after 2 seconds
      }, 1000);
    }
  } else {
    alert("Not enough currency to feed the pet.");
  }
};


  
  // Function to get the appropriate eating GIF
  const getEatingGif = (petType: string, evolutionRank: number): string => {
    switch (petType) {
      case "capybara":
        return evolutionRank === 2
          ? capybaraEvol2Eating
          : evolutionRank === 3
          ? capybaraEvol3Eating
          : capybaraEvol4Eating;
      case "cat":
        return evolutionRank === 2
          ? catEvol2Eating
          : evolutionRank === 3
          ? catEvol3Eating
          : catEvol4Eating;
      case "dinosaur":
        return evolutionRank === 2
          ? dinosaurEvol2Eating
          : evolutionRank === 3
          ? dinosaurEvol3Eating
          : dinosaurEvol4Eating;
      case "duck":
        return evolutionRank === 2
          ? duckEvol2Eating
          : evolutionRank === 3
          ? duckEvol3Eating
          : duckEvol4Eating;
      case "penguin":
        return evolutionRank === 2
          ? penguinEvol2Eating
          : evolutionRank === 3
          ? penguinEvol3Eating
          : penguinEvol4Eating;
      case "unicorn":
        return evolutionRank === 2
          ? unicornEvol2Eating
          : evolutionRank === 3
          ? unicornEvol3Eating
          : unicornEvol4Eating;
      default:
        return "";
    }
  };
  

  const getEvolutionGif = (petType: string, evolutionRank: number): string => {
    if (tempGif) {
      return tempGif;
    }
    switch (petType) {
      case "capybara":
        return evolutionRank === 1
          ? capybaraEvol1
          : evolutionRank === 2
          ? capybaraEvol2
          : evolutionRank === 3
          ? capybaraEvol3
          : capybaraEvol4;
      case "cat":
        return evolutionRank === 1
          ? catEvol1
          : evolutionRank === 2
          ? catEvol2
          : evolutionRank === 3
          ? catEvol3
          : catEvol4;
      case "dinosaur":
        return evolutionRank === 1
          ? dinosaurEvol1
          : evolutionRank === 2
          ? dinosaurEvol2
          : evolutionRank === 3
          ? dinosaurEvol3
          : dinosaurEvol4;
      case "duck":
        return evolutionRank === 1
          ? duckEvol1
          : evolutionRank === 2
          ? duckEvol2
          : evolutionRank === 3
          ? duckEvol3
          : duckEvol4;
      case "penguin":
        return evolutionRank === 1
          ? penguinEvol1
          : evolutionRank === 2
          ? penguinEvol2
          : evolutionRank === 3
          ? penguinEvol3
          : penguinEvol4;
      case "unicorn":
        return evolutionRank === 1
          ? unicornEvol1
          : evolutionRank === 2
          ? unicornEvol2
          : evolutionRank === 3
          ? unicornEvol3
          : unicornEvol4;
      default:
        return "";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const petData = pets.length > 0 ? pets[0] : null;

  return (
    <div
      style={{
        backgroundImage: `url(${
          petData
            ? backgrounds[backgroundIndex] // Use the current background when pet is claimed
            : claimBackground // Replace with your default background image URL
        })`,
      }}
      className="w-full h-full rounded-xl border-black flex flex-col bg-cover bg-center transition-all duration-500 px-5"
    >
      {petData ? (
        <>
          <div className="flex flex-row justify-between">
            <div>
              <div className="flex items-center mt-4">
                <h1 className="text-5xl font-extrabold mt-4 text-white">
                  {petData.pet_name}
                </h1>
                <h2 className="text-sm mt-10 ml-2 text-green-800">
                  {petData.pet_progress_bar}/{petData.pet_max_value}
                </h2>
              </div>
              <div className="flex items-center">
                <div className="w-32 h-4 bg-white rounded-full">
                  <div
                    className="h-4 rounded-full"
                    style={{
                      background: `linear-gradient(to right, #b3c1c1, #719191, #4a6464)`,
                      width: `${petData.pet_progress_bar}%`,
                    }}
                  ></div>
                </div>
              </div>
              <h2 className="text-lg font-bold">Phase: {petData.pet_evolution_rank}</h2>
            </div>
            <div className="w-24 h-8 bg-shades-light rounded-xl ml-auto mt-5 flex justify-center items-center text-lg font-semibold">
              <img
                src={currencyIcon} // Replace with the actual path to your biscuit icon
                alt="Currency Icon"
                className="w-16 h-12"
              />
              <span>{petData.pet_currency}</span>
            </div>
          </div>
          <div className="flex flex-col items-center mt-[13rem]">
            {!showEvolutionCinematic && (
              <>
                {/* Pet Image */}
                <img
                  src={getEvolutionGif(petData.pet_type, petData.pet_evolution_rank)}
                  alt="Pet"
                  className="w-[200px] h-[200px] object-contain transition-all duration-500"
                />
  
                {/* Buttons */}
                <div className="flex justify-center space-x-4">
                  {/* Left Arrow Button */}
                  <button
                    className="relative w-10 h-10 bg-primary-300 text-black font-bold rounded-md border-4 border-black shadow-md 
                      active:translate-y-1 active:shadow-none transition-transform duration-75"
                    onClick={() => changeBackground("left")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white" // Adjust text color to match the button's background
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
  
                  {/* Feed Button */}
                  <button
                    className={`relative w-24 h-10 bg-primary-900 text-white text-2xl font-bold rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                      active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] 
                      transition-transform duration-75 ${isFeeding ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleFeedPet(petData)}
                    disabled={isFeeding}
                  >
                    Feed
                  </button>
  
                  {/* Right Arrow Button */}
                  <button
                    className="relative w-10 h-10 bg-primary-300 text-black font-bold rounded-md border-4 border-black shadow-md 
                      active:translate-y-1 active:shadow-none transition-transform duration-75"
                    onClick={() => changeBackground("right")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white" // Adjust text color to match the button's background
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          {/* Claim a Pet Button in the Center */}
          <button
            className="bg-gradient-to-r from-[#b3c1c1] to-[#4a6464] py-3 px-6 text-white font-bold text-xl rounded-xl border-4 border-black shadow-lg 
              hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={handleClaimPet}
          >
            Claim a Pet
          </button>
        </div>
      )}
  
      {showModal && (
        <PetSelectionModal
          onClose={() => setShowModal(false)}
          onPetAdded={(pet) => {
            setPets([pet]);
            onPetAdded(pet);
            setShowCareMessageModal(true);
          }}
        />
      )}
  
      {showCareMessageModal && (
        <CareMessageModal
          onClose={() => {
            setShowCareMessageModal(false);
            window.location.reload();
          }}
        />
      )}
  
      {showEvolutionCinematic && petData && (
        <CinematicEvolutionModal
          pet={petData}
          onClose={() => setShowEvolutionCinematic(false)}
        />
      )}
    </div>
  );
};

export default Pets;