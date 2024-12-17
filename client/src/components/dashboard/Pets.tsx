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

  useEffect(() => {
    fetchPets();
  }, []);

  const handleClaimPet = () => {
    setShowModal(true);
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
        // Display eating GIF
        const eatingGif = `src/assets/pets/${updatedPet.pet_type}/evolution_${updatedPet.pet_evolution_rank}_eating.gif`;
        setTempGif(eatingGif);

        setTimeout(() => {
          setTempGif(null);
        }, 2000); // Reset to original GIF after 2 seconds
      }

      if (updatedPet.pet_progress_bar >= 100) {
        updatedPet.pet_progress_bar = 0;
        updatedPet.pet_evolution_rank += 1; // Update evolution rank here
        updatedPet.pet_max_value =
          updatedPet.pet_evolution_rank === 4
            ? 250
            : updatedPet.pet_evolution_rank === 3
            ? 200
            : 150;

        setShowEvolutionCinematic(true); // Trigger evolution cinematic
      } else {
        updatedPet.pet_currency -= 100;
        updatedPet.pet_progress_bar = Math.min(updatedPet.pet_progress_bar + 10, 100);
      }

      try {
        await axios.patch(
          `http://localhost:3002/pets/updatePet/${updatedPet.pet_id}`,
          {
            pet_currency: updatedPet.pet_currency,
            pet_progress_bar: updatedPet.pet_progress_bar,
            pet_evolution_rank: updatedPet.pet_evolution_rank,
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
      className={`w-full h-full rounded-xl border-black flex flex-col bg-cover bg-center transition-all duration-500 ${
        petData
          ? "bg-[url('src/assets/backgrounds/beach_background.png')]"
          : "bg-[url('src/assets/backgrounds/claimed_background.png')]"
      }`}
    >
      {petData ? (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="text-xl font-bold ml-4 mt-4">Pets</h1>
            <div className="w-28 h-8 bg-shades-light rounded-xl ml-auto mr-5 mt-5 flex justify-center items-center text-lg font-semibold">
              {petData.pet_currency}
            </div>
          </div>
          <div className="flex justify-center">
            <h2>{petData.pet_name}</h2>
          </div>
          <div className="flex flex-col items-center">
            {!showEvolutionCinematic && (
              <img
                src={getEvolutionGif(petData.pet_type, petData.pet_evolution_rank)}
                alt="Pet"
                className="w-10 h-64 md:w-96 md:h-96 object-contain transition-all duration-500"
              />
            )}
            <div className="w-64 md:w-96">
              <progress
                id="progressBar"
                value={petData.pet_progress_bar}
                max={100}
                className="w-full h-3 bg-black rounded-md"
              />
            </div>
            <div className="w-full md:w-96">
              <h2 className="font-semibold text-sm mb-1 text-[#354F52]">Pet Info</h2>
              <p className="text-sm text-[#354F52]">{petData.pet_type}</p>
              <p className="text-sm text-[#354F52]">Evolution Rank: {petData.pet_evolution_rank}</p>
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              className={`relative w-40 h-10 bg-red-600 text-black text-2xl font-bold rounded-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] 
                transition-transform duration-75
                ${isFeeding ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleFeedPet(petData)}
              disabled={isFeeding}
            >
              Feed
            </button>
          </div>
        </>
      ) : (
        <button
          className="bg-primary-dark py-2 px-4 text-black rounded-xl"
          onClick={handleClaimPet}
        >
          Claim a Pet
        </button>
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