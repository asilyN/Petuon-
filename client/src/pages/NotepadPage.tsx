/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import { FilePen, Trash2, FilePlus } from "lucide-react";
import WhiteContainer from "../components/WhiteContainer";
import SideBar from "../components/SideBar";
import Avatar from "../components/Avatar";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const NotepadPage: React.FC = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<string>("");
    const [editingNote, setEditingNote] = useState<number | null>(null);
    const [creatingNewNote, setCreatingNewNote] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("All");
    const [selectedNote, setSelectedNote] = useState<any | null>(null);

    const getRandomPastelColor = () => {
        const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Fetch notes from the Express backend using Axios
    
    const fetchNotes = async () => {
        try {
            
            const response = await axios.get('http://localhost:3002/notes/getNotes');
            const notesWithDateTime = response.data.map((note: any) => ({
                ...note,
                // createdDate: new Date(note.createdDate).toLocaleDateString(),
                // createdTime: new Date(note.createdDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }));
            setNotes(notesWithDateTime || []);
            console.log(notes);
        } catch (error) {
            console.error("Error fetching notes:", error);
            
        }
    };

    // Save or update note
    const saveNote = async () => {
        if (currentTitle.trim() === "" || currentNote.trim() === "") {
            console.error("Title or content is empty.");
            return;
        }
    
        const strippedNoteContent = currentNote.replace(/<\/?(h1|h2|h3|p|br)>/g, "").trim();
        const newNote = {
            title: currentTitle.trim(),
            content: strippedNoteContent,
            color: getRandomPastelColor(),
            created_date: new Date().toISOString().split('T')[0], // '2024-12-01'
            created_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), // '14:14:34'
        };
    
        console.log("New note payload:", newNote); // Debugging log
    
        try {
            let response;
            if (editingNote) {
                console.log('Updating note with ID:', editingNote); // Debugging log
                response = await axios.patch(`http://localhost:3002/notes/updateNote/${editingNote}`, newNote);
            
            } else {
                response = await axios.post("http://localhost:3002/notes/insertNote", newNote);
            }
    
            console.log("Server response:", response.data); // Success log
            await fetchNotes(); // Refresh notes list
            resetForm(); // Clear the form after successful operation
            } catch (error) {
            console.error("Error saving note:", error); // Log error details
            if (axios.isAxiosError(error)) {
                console.error("Server responded with:", error.response?.data || "Unknown error");
                }
            }
        };

    // Handle editing
    const editNote = (id: number) => {
        const noteToEdit = notes.find((note) => note.id === id); // Find the note to edit
        if (noteToEdit) {
            setEditingNote(id); // Set the current note as being edited
            setCurrentTitle(noteToEdit.title); // Populate the form with existing note data
            setCurrentNote(noteToEdit.content);
        } else {
            console.error(`Note with id ${id} not found.`);
            
        }
    };

    // Delete a note
    const deleteNote = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3002/notes/deleteNote/${id}`);
            await fetchNotes(); // Re-fetch the notes after deletion
            window.location.reload(); // Reload the page after deletion
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
                startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Start of the week (Monday)
                return noteDate >= startOfWeek;
            } else if (filter === "This Month") {
                return noteDate.getMonth() === today.getMonth() && noteDate.getFullYear() === today.getFullYear();
            }
            return true; // Default is "All"
        });

        // Sort by id in descending order for "All" filter
        if (filter === "All") {
            filtered.sort((a, b) => b.id - a.id);
        }

        return filtered;
    };

    const filteredNotes = getFilteredNotes();

    useEffect(() => {
        fetchNotes(); // Fetch notes on mount
    }, []);

    return (
        <>
            <WhiteContainer>
                <h1  style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 mt-7"> My Notes</h1>

                {/* Filter Buttons */}
                {editingNote === null && !creatingNewNote && selectedNote === null && (
                    <div className="font-serif font-bold text-[#354F52] flex space-x-2 mt-[-15px] mb-0 my-3">
                        <button onClick={() => setFilter("All")} className={`px-4 py-2 rounded-md ${filter === "All" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}>All</button>
                        <button onClick={() => setFilter("Today")} className={`px-4 py-2 rounded-md ${filter === "Today" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}>Today</button>
                        <button onClick={() => setFilter("Yesterday")} className={`px-4 py-2 rounded-md ${filter === "Yesterday" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}>Yesterday</button>
                        <button onClick={() => setFilter("This Week")} className={`px-4 py-2 rounded-md ${filter === "This Week" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}>This Week</button>
                        <button onClick={() => setFilter("This Month")} className={`px-4 py-2 rounded-md ${filter === "This Month" ? "font-serif font-bold bg-[#657F83] text-white" : "bg-none"} hover:scale-110`}>This Month</button>
                    </div>
                )}

                {/* Notes Editor or Full Note View */}
                {editingNote !== null || creatingNewNote ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative mb-4 my-5 overflow-y-auto max-h-[36rem] w-full md:w-[84rem]">
                        <h2 className="text-lg font-semibold">{editingNote ? "Edit Note" : "Create New Note"}</h2>
                        {editingNote && (
                            <button onClick={() => deleteNote(editingNote)} className="absolute top-5 right-5 text-red-500 hover:text-red-700">
                                <Trash2 size={25} />
                            </button>
                        )}
                        <div className="flex items-center justify-between mb-4">
                            <input
                                type="text"
                                value={currentTitle}
                                onChange={(e) => setCurrentTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full p-2 border-b mb-4 text-lg font-bold"
                            />
                        </div>
                        <ReactQuill value={currentNote} onChange={handleEditorChange} theme="snow" />
                        <div className="mt-4 flex justify-between">
                            <button onClick={cancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
                            <button onClick={() => {
                                if (currentTitle.trim() === "" || currentNote.trim() === "") {
                                    alert("Title must be filled.");
                                } else {
                                    saveNote();
                                }
                            }} className="px-4 py-2 bg-[#354F52] text-white rounded-md hover:bg-blue-700">
                                {editingNote ? "Save Changes" : "Save Note"}
                            </button>
                        </div>  
                    </div>
                ) : selectedNote ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative mb-4 my-5  overflow-y-auto max-h-[36rem] w-full md:w-[84rem]">
                        <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
                        <button onClick={closeNoteView} className="absolute top-3 right-5 text-red-500 hover:text-red-700">Close</button>
                        <div className="mt-4">
                            <ReactQuill value={selectedNote.content} readOnly={true} theme="snow" />
                        </div>
                    </div>
                ) : (

                    /* Notes List */
                    <div className="mt-0 -ml-6">
                    <div className="overflow-x-auto p-6 -mt-2">
                        <div className="grid grid-rows-[repeat(2,minmax(0,1fr))] grid-flow-col gap-y-2 gap-x-5 w-max  ">
                            {/* New Note Button */}
                            <div
                                className="border rounded-3xl cursor-pointer shadow-lg hover:shadow-xl flex flex-col items-center justify-center mb-2 transform transition-transform duration-200 hover:scale-105 active:scale-20,"
                                onClick={() => setCreatingNewNote(true)}
                                style={{ 
                                    width: "16rem", // Set consistent width
                                    minHeight: "16rem", // Set consistent height
                                    backgroundColor: "#F9F9F9" 
                                }}
                                //add icon
                                >
                                <FilePlus size={90}  className="mb-2 text-[#354F52] " />  
                            </div>                  
                            {/* Render Notes */}
                            {filteredNotes.length === 0 ? (
                                <div className="text-center mt-4 ml-5 ">
                                    
                                    <img src="src\assets\sleeping_penguin2.gif" alt="No notes available" className=" w-[15rem] h-[15rem] ml-[34rem] mt-[-13rem]" />
                                    <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-2xl ml-[36rem] mt-[-1.5rem] text-gray-500">No notes available.</p>
                                </div>
                            ) : (
                                filteredNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="border rounded-3xl shadow-lg hover:shadow-xl relative cursor-pointer mb-2 transform transition-transform duration-200 hover:scale-105 active:scale-20"
                                        style={{ 
                                            width: "16rem", // Set consistent width
                                            minHeight: "16rem", // Set consistent height
                                            backgroundColor: note.color 
                                        }}
                                        onClick={() => handleNoteClick(note)}
                                    >
                                        <h4 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-xs text-black-500 ml-3 mt-3 ">{new Date(note.created_date).toLocaleDateString()}</h4>
                                        <h3 style={{ fontFamily: '"Signika Negative", sans-serif' }} className="uppercase font-bold text-xl mb-1 ml-3 ">
                                            {note.title.length > 14 ? `${note.title.slice(0, 14)}...` : note.title}</h3>
                                        <hr className="border-t-2 border-black w-full mb-2" />
                                        <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className="text-gray-700 ml-3">
                                            {note.content.length > 20 ? `${note.content.slice(0, 20)}...` : note.content}
                                        </p>
                                        <p style={{ fontFamily: '"Signika Negative", sans-serif' }} className="font-serif text-xs text-black-500 absolute bottom-3 left-5">{new Date(`1970-01-01T${note.created_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); editNote(note.id); }}
                                            className="absolute top-7 right-3 text-black hover:text-[#719191]"
                                        >
                                            <FilePen size={20} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>  
                </div>
                )}
                 <Avatar/>
            </WhiteContainer>
            <SideBar />
        </>
    );
};

export default NotepadPage;