export interface Flashcard {
  question: string;
  answer: string;
  flashcard_id: string | null;
  unique_flashcard_id: string;
  progress: boolean;
}

export interface CreateFlashcardProps {
  flashcards: Flashcard[];
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  flashCardId: string | null; 
}

// Structure of a saved deck, including the `id` and `flashcards` it contains
export type Deck = {
  deck_id: string;
  title: string;
};


export interface quizFlashcardProps {
  setOnFirstPage: React.Dispatch<React.SetStateAction<boolean>>;
  flashcards: Flashcard[];
}


