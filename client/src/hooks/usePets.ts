import { useState, useEffect } from "react";
import axios from "axios";
import { Pet } from "../types/PetTypes"; // Assuming a Pet interface exists

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [afterLoading, setAfterLoading] = useState<boolean>(false); // To track loading state
  const [error, setError] = useState<string>(""); // To track error messages
  const token = localStorage.getItem("token");
  const [hasPet, setHasPet] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Pets
  const fetchPets = async () => {
    setError(""); // Clear previous errors
    setHasPet(true);
    setLoading(true);
    try {
      console.log("Fetching pets...");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/pets/getPets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API response:", response.data);

      if (response.data && response.data.length > 0) {
        localStorage.setItem("pet_id", response.data[0].pet_id); // fetch pet id and store in local storage

        // Assuming the response data is an array of pet objects
        const petsWithDateTime: Pet[] = response.data.map((pet: any) => ({
          pet_id: pet.pet_id, // Assuming pet_id exists in response
          pet_type: pet.pet_type, // Assuming pet_type exists in response
          pet_name: pet.pet_name, // Assuming pet_name exists in response
          pet_currency: pet.pet_currency || 0, // Default to 0 if not available
          pet_progress_bar: pet.pet_progress_bar || 0, // Default to 0 if not available
          pet_evolution_rank: pet.pet_evolution_rank || 1, // Default to 1 if not available
          pet_max_value: pet.pet_max_value || 150, // Default to 150 if not available
          created_date: pet.created_date || new Date().toISOString().split("T")[0], // Default current date if not available
          created_time: pet.created_time || new Date().toTimeString().split(" ")[0], // Default current time if not available
        }));
        // Set the fetched data into state
        setPets(petsWithDateTime);
        setHasPet(true);
      } else {
        setHasPet(false);
        console.warn("No pets found for the user.");
      }
    } catch (error: any) {
      console.error("Error fetching pets:", error);
      setError("Failed to fetch pets. Please try again later.");
      setHasPet(false);
    } finally {
      setLoading(false);
      setAfterLoading(true); // End loading
    }
  };

  // Call fetchPets on initial render
  useEffect(() => {
    fetchPets();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Add Pet
  const addPet = async (newPet: Pet) => {
    if (!token) {
      console.error("User not authenticated. No token found.");
      setError("User not authenticated. No token found.");
      return;
    }

    try {
      const petWithUserId = {
        ...newPet,
      };

      console.log("Inserting pet data:", petWithUserId);

      await axios.post(`${import.meta.env.VITE_API_URL}/pets/insertPet`, petWithUserId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPets(); // Refresh the pet list after adding
    } catch (error: any) {
      console.error("Error adding pet:", error);
      setError("Failed to add pet. Please try again later.");
    }
  };

  // Save Pet (Update Pet)
  const savePet = async (
    updatedPet: Pet,
    currentPets: Pet[],
    editingPetId: string
  ) => {
    if (!token) {
      console.error("User not authenticated. No token found.");
      setError("User not authenticated. No token found.");
      return;
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/pets/updatePet/${editingPetId}`,
        updatedPet,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPets(currentPets); // Update the pets list after the save
    } catch (error: any) {
      console.error("Error saving pet:", error);
      setError("Failed to save pet. Please try again later.");
    }
  };

  // Delete Pet
  const deletePet = async (pet_id: string) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== pet_id));

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/pets/deletePet/${pet_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error("Error deleting pet:", error);
      setError("Failed to delete pet. Please try again later.");
    }
  };

  const updatePet = async (updatedPet: Pet) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/pets/updatePet/${updatedPet.pet_id}`,
      {
        pet_currency: updatedPet.pet_currency,
        pet_progress_bar: updatedPet.pet_progress_bar,
        pet_evolution_rank: updatedPet.pet_evolution_rank,  // Ensure evolution rank is updated
        updated_date: new Date(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  return {
    fetchPets,
    addPet,
    pets,
    setPets,
    savePet,
    deletePet,
    afterLoading,
    updatePet,
    hasPet,
    error, // Return loading and error states
    loading
  };
};