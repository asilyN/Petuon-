import { useState } from "react";

//eggs
import capybara from "../../assets/eggs/capibara_egg.png";
import cat from "../../assets/eggs/cat_egg.png";
import dinosaur from "../../assets/eggs/dinosaur_egg.png";
import duck from "../../assets/eggs/duck_egg.png";
import penguin from "../../assets/eggs/penguin_egg.png";
import unicorn from "../../assets/eggs/unicorn_egg.png";


import { usePets } from "../../hooks/usePets";
import { v4 as uuidv4 } from "uuid";
import { Pet } from "../../types/PetTypes";

interface PetSelectionModalProps {
  onClose: () => void;
  onPetAdded: (petData: any) => void 
}

const PetSelectionModal: React.FC<PetSelectionModalProps> = ({ onClose,  onPetAdded }) => {
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [petName, setPetName] = useState<string>("");
  const { addPet } = usePets();


  const petColors: Record<string, string> = {
    capybara: "border-red-500",
    cat: "border-yellow-200",
    dinosaur: "border-green-500",
    duck: "border-yellow-400",
    penguin: "border-gray-500",
    unicorn: "border-pink-500",
  };

  const petEggImages: Record<string, string> = {
    capybara: capybara,
    cat: cat,
    dinosaur: dinosaur,
    duck: duck,
    penguin: penguin,
    unicorn: unicorn,
  };

  const handlePetSelection = (pet: string) => {
    setSelectedPet(pet);
  };

  const handleSubmit = async () => {
    if (!selectedPet || !petName.trim()) {
      alert("Please select a pet and enter a valid name.");
      return;
    }

    // Prepare pet data to be inserted
    const now = new Date();
    const petData: Pet = {
      pet_id: uuidv4(),
      pet_type: selectedPet,
      pet_name: petName.trim(),
      pet_currency: 1000,
      pet_progress_bar: 0,
      pet_evolution_rank: 1,
      pet_max_value: 150,
      created_date: now.toISOString().split("T")[0],
      created_time: now.toTimeString().split(" ")[0],
    };

    console.log("Adding pet data:", petData); // Log for debugging

    try {
      await addPet(petData); // Add pet data to backend
      onPetAdded(petData)
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("There was an issue adding your pet. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Choose Your Pet</h2>

        {/* Egg Image Preview */}
        {selectedPet && (
          <div className="flex flex-col items-center mb-4">
            <span className="text-lg font-semibold mb-2">
              {selectedPet.charAt(0).toUpperCase() + selectedPet.slice(1)}
            </span>
            <img
              src={petEggImages[selectedPet]}
              alt={`${selectedPet} egg`}
              className="w-24 h-24"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4 text-base">
          {["unicorn", "capybara", "dinosaur", "duck", "penguin", "cat"].map(
            (pet) => (
              <button
                key={pet}
                className={`w-20 h-20 p-2 border-2 rounded-md ${petColors[pet]} transition-all duration-300 ${
                  selectedPet === pet ? "scale-110 p-4 border-4" : "p-2"
                }`}
                onClick={() => handlePetSelection(pet)}
              >
                <img
                  src={petEggImages[pet]}
                  alt={`${pet} egg`}
                  className="w-full h-full object-contain"
                />
              </button>
            )
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="petName" className="block text-sm font-semibold mb-1">
            Pet Name:
          </label>
          <input
            type="text"
            id="petName"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter pet name"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Claim Pet
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetSelectionModal;
