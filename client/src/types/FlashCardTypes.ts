export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  deck_id: number;
}

export interface CreateFlashcardProps {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  deckId: number; // Add this to pass the deck ID dynamically
}


// Response for fetching decks from the API
export type DecksResponse = {
  [key: string]: {

    id: string;

    flashcards: Flashcard[];

  };
};

// Response for fetching flashcards from the API
export type FlashcardsResponse = Flashcard[];

// Structure of a saved deck, including the `id` and `flashcards` it contains
export type Deck = {
  id: number;
  title: string;
  flashcards: Flashcard[];
};


export type SaveDeckResponse = {
  success: boolean;
  message: string;
};


export type DeleteFlashcardResponse = {
  success: boolean;
  message: string;
};

export interface quizFlashcardProps {
  setOnFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  flashcards: Flashcard[];
}


