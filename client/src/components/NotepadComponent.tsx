import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { FilePen, Trash2, FilePlus } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNotepad } from "../hooks/useNotepad";
import { motion } from "framer-motion";

const NotepadComponent: React.FC = () => {
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<string>("");
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [creatingNewNote, setCreatingNewNote] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("All");
    const [selectedNote, setSelectedNote] = useState<any | null>(null);

    const {notes, addNote, saveNOte, deleteNOte, loading, afterLoading, setNotes} = useNotepad();
    
    const notesContainerRef = useRef<HTMLDivElement | null>(null);
    const newNoteRef = useRef<HTMLDivElement | null>(null); // Ref for the new note
    

    const getRandomPastelColor = () => {
        const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

      const updateTasks = useCallback(() => {
        setNotes((prevNote) =>
          prevNote.map((note) => {
            return note;
          }),
        );
      }, []);
    
      useEffect(() => {
        const interval = setInterval(updateTasks, 1000);
    
        return () => clearInterval(interval);
      }, [updateTasks]);
    // Save or update note
    const saveNote = async () => {
      if (currentTitle.trim() === "" || currentNote.trim() === "") {
        console.error("Title or content is empty.");
        return;
      }
    
      const strippedNoteContent = currentNote
        .replace(/<\/?(h1|h2|h3|p|br)>/g, "")
        .trim();
    
      const newNote = {
        note_id: uuidv4(),
        title: currentTitle.trim(),
        content: strippedNoteContent,
        color: getRandomPastelColor(),
        created_date: new Date().toISOString().split("T")[0], // '2024-12-01'
        created_time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      };

      try {
        if (editingNote) {
          const updatedNotes = notes.map((note) =>
            note.note_id === editingNote
              ? { ...note, title: newNote.title, content: newNote.content }
              : note
          );

          await saveNOte(newNote, updatedNotes, editingNote)
          setEditingNote(null)
        } else {
          await addNote(newNote)

          if (notesContainerRef.current && newNoteRef.current) {
            // Scroll the new note into view
            newNoteRef.current.scrollIntoView({
              behavior: 'smooth', // Optional: adds smooth scrolling
              block: 'nearest', // Adjusts where the note appears in the view
            });
          }
          resetForm();
          setEditingNote(null)
        }
      } catch (error) {
        console.error("Error saving note:", error);
        if (axios.isAxiosError(error)) {
          console.error("Server responded with:", error.response?.data || "Unknown error");
          console.error("Error message:", error.message);
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };


    // Automatically scroll to the right when the notes change

    // Handle editing
    const editNote = (note_id: string) => {
        const noteToEdit = notes.find((note) => note.note_id === note_id); // Find the note to edit\
        if (noteToEdit) {
        setEditingNote(note_id); 
        setCurrentTitle(noteToEdit.title); 
        setCurrentNote(noteToEdit.content);
        } else {
        console.error(`Note with id ${note_id} not found.`);
        }
    };

    // Delete a note
    const deleteNote = async (note_id: string) => {
        try {
        await deleteNOte(note_id)
        setEditingNote(null)

        } catch (error) {
        console.error("Error deleting note:", error);
        }
    };

    // Reset form after save/edit
    const resetForm = () => {
        setCurrentTitle("");
        setCurrentNote("");
        setEditingNote(null);
        setCreatingNewNote(false);
    };

    // Handle note selection
    const handleNoteClick = (note: any) => {
        setSelectedNote(note);
    };

    // Close note view
    const closeNoteView = () => {
        setSelectedNote(null);
    };

    // Handle editor change
    const handleEditorChange = (content: string) => {
        setCurrentNote(content);
    };

    // Cancel edit or creation
    const cancelEdit = () => {
        resetForm();
    };


    // Filter notes based on criteria
    const getFilteredNotes = () => {
        const today = new Date();
        const filtered = notes.filter((note) => {
        const noteDate = new Date(note.created_date);
        if (filter === "Today") {
            return noteDate.toDateString() === today.toDateString();
        } else if (filter === "Yesterday") {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            return noteDate.toDateString() === yesterday.toDateString();
        } else if (filter === "This Week") {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(
            today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1),
            ); // Start of the week (Monday)
            return noteDate >= startOfWeek;
        } else if (filter === "This Month") {
            return (
            noteDate.getMonth() === today.getMonth() &&
            noteDate.getFullYear() === today.getFullYear()
            );
        }
        return true; // Default is "All"
        });
   
        return filtered;
    };

    const filteredNotes = getFilteredNotes();
    
    const taskVariants = {
      hidden: { opacity: 0, y: 0 }, // Initial state: invisible and above
      visible: { opacity: 1, y: 0 }, // Final state: visible and at the correct position
    };
    const staggerTime = 1; // Total duration for all tasks to be rendered (in seconds)
    const delayPerItem = staggerTime / notes.length; // Time delay per task
    console.log(afterLoading)
    return (
      <>
      <h1
        style={{ fontFamily: '"Crimson Pro", serif' }}
        className="ftracking-normal mb-4 mt-7 text-[3rem] text-[#354F52]"
      >
        {" "}
        My Notes
      </h1>

      {/* Filter Buttons */}
      {editingNote === null && !creatingNewNote && selectedNote === null && (
        <div className="my-3 mb-0 mt-[-15px] flex space-x-2 font-serif font-bold text-[#354F52]">
          <button
            onClick={() => setFilter("All")}
            className={`rounded-md px-4 py-2 ${filter === "All" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("Today")}
            className={`rounded-md px-4 py-2 ${filter === "Today" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
          >
            Today
          </button>
          <button
            onClick={() => setFilter("Yesterday")}
            className={`rounded-md px-4 py-2 ${filter === "Yesterday" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setFilter("This Week")}
            className={`rounded-md px-4 py-2 ${filter === "This Week" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter("This Month")}
            className={`rounded-md px-4 py-2 ${filter === "This Month" ? "bg-[#657F83] font-serif font-bold text-white" : "bg-none"} hover:scale-110`}
          >
            This Month
          </button>
        </div>
      )}

      {/* Notes Editor or Full Note View */}
      {editingNote !== null || creatingNewNote ? (
        <div className="relative my-5 mb-4 max-h-[36rem] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg md:w-[84rem]">
          <h2 className="text-lg font-semibold">
            {editingNote ? "Edit Note" : "Create New Note"}
          </h2>
          {editingNote && (
            <button
              onClick={() => deleteNote(editingNote)}
              className="absolute right-5 top-5 text-red-500 hover:text-red-700"
            >
              <Trash2 size={25} />
            </button>
          )}
          <div className="mb-4 flex items-center justify-between">
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Title"
              className="mb-4 w-full border-b p-2 text-lg font-bold"
            />
          </div>
          <ReactQuill
            value={currentNote}
            onChange={handleEditorChange}
            theme="snow"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={cancelEdit}
              className="rounded-md bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (currentTitle.trim() === "" || currentNote.trim() === "") {
                  alert("Title must be filled.");
                } else {
                  saveNote();
                }
              }}
              className="rounded-md bg-[#354F52] px-4 py-2 text-white hover:bg-blue-700"
            >
              {editingNote ? "Save Changes" : "Save Note"}
            </button>
          </div>
        </div>
      ) : selectedNote ? (
        <div className="relative my-5 mb-4 max-h-[36rem] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg md:w-[84rem]">
          <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
          <button
            onClick={closeNoteView}
            className="absolute right-5 top-3 text-red-500 hover:text-red-700"
          >
            Close
          </button>
          <div className="mt-4">
            <ReactQuill
              value={selectedNote.content}
              readOnly={true}
              theme="snow"
              modules={{ toolbar: false }}
            />
          </div>
        </div>
      ) : (
        /* Notes List */
        <div className="-ml-6 mt-0">
          <div className="-mt-2 overflow-x-auto p-6" ref={notesContainerRef}>
            <div className="grid w-max grid-flow-col grid-rows-[repeat(2,minmax(0,1fr))] gap-x-5 gap-y-2">
              {/* New Note Button */}
              <div
                ref={notesContainerRef} 
                className="active:scale-20, mb-2 flex transform cursor-pointer flex-col items-center justify-center rounded-3xl border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                onClick={() => setCreatingNewNote(true)}
                style={{
                  width: "16rem", // Set consistent width
                  minHeight: "16rem", // Set consistent height
                  backgroundColor: "#F9F9F9",
                }}
                //add icon
              >
                <FilePlus size={90} className="mb-2 text-[#354F52]" />
              </div>
              {loading ? (
                <h1 className="ml-[36rem] mt-[-2.5rem] text-2xl text-gray-500">
                  Fetching notes...
                </h1>
              ) : filteredNotes.length === 0 ? (
                <div className="ml-5 mt-4 text-center">
                  <img
                    src="src\assets\sleeping_penguin2.gif"
                    alt="No notes available"
                    className="ml-[34rem] mt-[-13rem] h-[15rem] w-[15rem]"
                  />
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="ml-[36rem] mt-[-1.5rem] text-2xl text-gray-500"
                  >
                    No notes available.
                  </p>
                </div>
              ) : null}

              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.note_id}
                  className="active:scale-20 relative mb-2 transform cursor-pointer rounded-3xl border shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
                  style={{
                    width: "16rem", // Set consistent width
                    minHeight: "16rem", // Set consistent height
                    backgroundColor: note.color,
                  }}
                  onClick={() => handleNoteClick(note)}
                  variants={afterLoading ? taskVariants : undefined}
                  initial={afterLoading ? "hidden" : { y: 0 }}
                  animate={afterLoading ? "visible" : undefined}
                  exit={afterLoading ? "visible" : undefined}
                  transition={
                    afterLoading
                      ? { duration: 0.2, delay: index * delayPerItem }
                      : undefined
                  }
                  ref={index === notes.length - 1 ? newNoteRef : null} 
                >
                  <h4
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="text-black-500 ml-3 mt-3 text-xs"
                  >
                    {new Date(note.created_date).toLocaleDateString()}
                  </h4>
                  <h3
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="mb-1 ml-3 text-xl font-bold uppercase"
                  >
                    {note.title.length > 14
                      ? `${note.title.slice(0, 14)}...`
                      : note.title}
                  </h3>
                  <hr className="mb-2 w-full border-t-2 border-black" />
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="ml-3 text-gray-700"
                  >
                    {note.content.length > 20
                      ? `${note.content.slice(0, 20)}...`
                      : note.content}
                  </p>
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="text-black-500 absolute bottom-3 left-5 font-serif text-xs"
                  >
                    {new Date(`1970-01-01T${note.created_time}`).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editNote(note.note_id);
                    }}
                    className="absolute right-3 top-7 text-black hover:text-[#719191]"
                  >
                    <FilePen size={20} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

    


export default NotepadComponent;