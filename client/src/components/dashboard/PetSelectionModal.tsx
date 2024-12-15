import { useState } from "react";
import capybara from "../../assets/capibara_egg.png";
import cat from "../../assets/cat_egg.png";
import dinosaur from "../../assets/dinosaur_egg.png";
import duck from "../../assets/duck_egg.png";
import penguin from "../../assets/penguin_egg.png";
import unicorn from "../../assets/unicorn_egg.png";

interface PetSelectionModalProps {
  onClose: () => void;
  onPetAdded: (petData: any) => void;
}

const PetSelectionModal: React.FC<PetSelectionModalProps> = ({
  onClose,
  onPetAdded,
}) => {
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [petName, setPetName] = useState<string>("");

  const petColors: Record<string, string> = {
    capybara: "border-red-500",
    cat: "border-yellow-200",
    dinosaur: "border-green-500",
    duck: "border-yellow-400", // Gold-like color
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

  const handleSubmit = () => {
    if (!selectedPet || !petName) {
      alert("Please select a pet and enter a name.");
      return;
    }

    // Just display the selected pet data (no DB call yet)
    const petData = {
      pet_type: selectedPet,
      pet_name: petName,
      pet_currency: 1000, // Default currency
      pet_progress_bar: 0, // Default progress
      pet_evolution_rank: 1, // Default evolution rank starts at 1
      pet_max_value: 150, // Default max value
    };

    onPetAdded(petData); // Pass the pet data to the parent
    onClose(); // Close the modal
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
                className={`w-20 h-20 p-2 border-2 rounded-md ${
                  petColors[pet]
                } transition-all duration-300 ${
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
