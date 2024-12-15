import { useState, useEffect } from "react";
import axios from "axios";
import { Note } from "../types/NotepadTypes";

export const useNotepad= () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const token = localStorage.getItem('token');

    // Fetched Notes
    const fetchNotes = async () => {
        try {
        const response = await axios.get("http://localhost:3002/notes/getNotes", {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });
        
        const notesWithDateTime = response.data.map((note: any) => ({
            ...note,}));
        setNotes(notesWithDateTime);
        } catch (error) {
        console.error("Error fetching notes:", error);
        }
    };

    useEffect(() => {
        fetchNotes(); // Fetch notes on mount
      }, []);
      
    // Adding Note
    const addNote = async (newNote: Note) => {
        if (!token) {
            console.error("User not authenticated. No token found.");
            return;
          }
        
        const response = await axios.post(
            `http://localhost:3002/notes/insertNote`,
            newNote,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );
        const savedNote = response.data
        setNotes([...notes, savedNote])
    }

    // Save Note
    const saveNOte = async (newNote: Note, updatedNote: Note[], editingNote: string) => {
        if (!token) {
            console.error("User not authenticated. No token found.");
            return;
          }
        
        await axios.patch(
            `http://localhost:3002/notes/updateNote/${editingNote}`,
            newNote,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setNotes(updatedNote)
    }

    // Deleting Note
    const deleteNOte = async (note_id: string) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note.note_id !== note_id));
        await axios.delete(`http://localhost:3002/notes/deleteNote/${note_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
    }

    return {
        fetchNotes,
        addNote,
        notes,
        setNotes,
        saveNOte,
        deleteNOte
    };
};