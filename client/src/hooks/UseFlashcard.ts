import { useState, useEffect } from "react";
import axios from "axios";
import { Deck, Flashcard } from "../types/FlashCardTypes";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const token = localStorage.getItem("token");
//main flashcard hooks
export const useFlashcardHooks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [onFirstPage, setOnFirstPage] = useState<boolean>(true);
  const [deckTitle, setDeckTitle] = useState<string>("");
  const [deckId, setDeckId] = useState<string | null>(null);

  const [loadCards, setLoadCards] = useState<boolean>(false);
  const [loadDecks, setLoadDecks] = useState<boolean>(false);

  // Fetch decks and flashcards on mount
  const fetchDecks = async () => {
    setLoadDecks(true)
    try {
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getDecks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
        deck_id: deck.deck_id,
        title: deck.title,
      }));
      setDecks(deckData);
    } catch (error) {
      console.error("Error fetching decks:", error);
    } finally {
      setLoadDecks(false)
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  // Watch for deckId changes
  useEffect(() => {
    if (deckId) console.log(`Updated deckId: ${deckId}`);
  }, [deckId]);

  const saveDeck = async () => {
    if (!deckTitle.trim()) {
      alert("Deck title cannot be empty.");
      return;
    }

    try {
      setOnFirstPage(true);
      const data: Deck = { title: deckTitle, deck_id: uuidv4() };

      await axios.post(`${import.meta.env.VITE_API_URL}/cards/insertDecks`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeckTitle("");
     toast.success("Deck created successfully!");

    } catch (error) {
      console.error("Error saving deck:", error);
    }
  };

  const loadDeck = async (deck_id: string) => {
    setLoadCards(true)
    try {
      setDeckId(deck_id);
      setIsReviewing(false);
      setOnFirstPage(false);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getFlashcards`, {
        params: { deck_id },
      });

      const flashcardData = response.data.map((flashcard: {
        question: string;
        answer: string;
        flashcard_id: string;
        unique_flashcard_id: string;
      }) => ({
        question: flashcard.question,
        answer: flashcard.answer,
        flashcard_id: flashcard.flashcard_id,
        unique_flashcard_id: flashcard.unique_flashcard_id,
      }));

      setFlashcards(flashcardData);
    } catch (error) {
      console.error("Error loading deck:", error);
      setFlashcards([]);
    } finally {
      setLoadCards(false)
    }
  };

  const deleteDeck = async (deckId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cards/deleteDeck/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDecks(decks.filter((deck) => deck.deck_id !== deckId));
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const deleteFlashcard = async (unique_flashcard_id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cards/deleteFlashcard/${unique_flashcard_id}`);
      setFlashcards(flashcards.filter((flashcard) => flashcard.unique_flashcard_id !== unique_flashcard_id));
      console.log("Flashcard deleted successfully!");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };
  const openEditModal = (deck_id: string) => {
    setDeckId(deck_id);  // Set the deckId when editing
    setDeckTitle(decks.find(deck => deck.deck_id === deck_id)?.title || ""); // Set the current title
    setIsEditModalOpen(true);
  };

  const handleUpdateDeckTitle = async () => {
    if (!deckTitle || deckTitle.trim() === "") {
      toast.warn("Please enter a valid title.");
      return;
    }
  
    if (!deckId) {
      toast.warn("No deck selected for update.");
      return;
    }
  
    try {
      const updateResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/cards/updateDeckTitle/${deckId}`,
        { title: deckTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (updateResponse.status === 200) {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cards/getDecks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const deckData = response.data.map((deck: { deck_id: string; title: string }) => ({
          deck_id: deck.deck_id,
          title: deck.title,
        }));
  
        setDecks(deckData);
        setIsEditModalOpen(false); // Close the modal after success
        toast.success("Deck title updated successfully!");
      } else {
        toast.error("Failed to update deck title");
      }
    } catch (error) {
      console.error("Error updating deck title:", error);
      toast.error("An error occurred while updating the deck title.");
    }
  };
  

  const updateFlashcard = async (flashcardId: string, newValue: string, field: "question" | "answer") => {
    try {
      const data: { question?: string; answer?: string } = {};
      data[field] = newValue; // Dynamically set the field being updated
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cards/updateFlashcard/${flashcardId}`,
        data
      );
      console.log(`${field} updated successfully!`, response.data);
    } catch (error) {
      console.error("Error updating flashcard:", error|| error);
      alert("Failed to update the flashcard. Please try again later.");
    }
  };
  

  return {
    loadDecks,
    loadCards,
    flashcards,
    decks,
    isReviewing,
    onFirstPage,
    deckTitle,
    deckId,
    isModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    setIsModalOpen,
    setDecks,
    setFlashcards,
    setDeckTitle,
    setDeckId,
    setIsReviewing,
    setOnFirstPage,
    saveDeck,
    loadDeck,
    deleteDeck,
    deleteFlashcard,
    updateFlashcard,
    fetchDecks,
    openEditModal,
    handleUpdateDeckTitle

  };
};