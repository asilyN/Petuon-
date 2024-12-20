import { useState, useEffect } from "react";
import axios from "axios";
import { Note } from "../types/NotepadTypes";

export const useNotepad= () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState<boolean>(false)
    const [afterLoading, setAfterLoading] = useState<boolean>(false);
    // Fetched Notes
    const fetchNotes = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/notes/getNotes`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const notesWithDateTime = response.data.map((note: any) => ({
                ...note,}));
            setNotes(notesWithDateTime);
        } catch (error) {
            console.error("Error fetching notes:", error);
            
        } finally {
            setLoading(false)
            setAfterLoading(true)
        }
    };

    useEffect(() => {
        fetchNotes(); // Fetch notes on mount
      }, []);

      useEffect(() => {
        if (setAfterLoading) {
          const timer = setTimeout(() => {
            setAfterLoading(false);
            return () => clearTimeout(timer);
          }, 1200);
        }
      });
    
      
    // Adding Note
    const addNote = async (newNote: Note) => {
        if (!token) {
            console.error("User not authenticated. No token found.");
            return;
          }
        
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/notes/insertNote`,
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
            `${import.meta.env.VITE_API_URL}/notes/updateNote/${editingNote}`,
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/notes/deleteNote/${note_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
    }

    return {
        loading,
        fetchNotes,
        addNote,
        notes,
        setNotes,
        saveNOte,
        deleteNOte,
        afterLoading
    };
};