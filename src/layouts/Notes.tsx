import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
declare module 'react-quill';
import Sidebar from './Sidebar';  // Import Sidebar component
import { PlusCircle, FilePen, Trash2, Upload } from "lucide-react"; // Add Upload icon
import BG from "../assets/BG.png";
import "react-quill/dist/quill.snow.css";

const getRandomPastelColor = () => {
    const colors = ["#FE9B72", "#FFC973", "#E5EE91", "#B692FE"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [currentTitle, setCurrentTitle] = useState<string>("");
    const [currentNote, setCurrentNote] = useState<string>(""); 
    const [editingNote, setEditingNote] = useState<number | null>(null);
    const [creatingNewNote, setCreatingNewNote] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("All");
    const [selectedNote, setSelectedNote] = useState<any | null>(null); // New state for the selected note

    const handleEditorChange = (value: string) => setCurrentNote(value);

    const saveNote = () => {
        if (currentNote.trim() === "" || currentTitle.trim() === "") return;
    
        // Strip out <p> tags from the content
        const strippedNoteContent = currentNote.replace(/<\/?p>/g, '');
    
        const newNote = {
            id: Date.now(),
            title: currentTitle,
            content: strippedNoteContent, // Save the stripped content
            color: getRandomPastelColor(),
            createdDate: new Date().toLocaleDateString(),
            createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().getTime(),
        };
    
        const updatedNotes = editingNote !== null 
            ? notes.map((note) => note.id === editingNote ? newNote : note) 
            : [...notes, newNote];
        
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setCurrentNote("");
        setCurrentTitle("");
        setEditingNote(null);
        setCreatingNewNote(false);
    };
    

    const editNote = (id: number) => {
        const noteToEdit = notes.find((note) => note.id === id);
        if (noteToEdit) {
            setEditingNote(id);
            setCurrentTitle(noteToEdit.title);
            setCurrentNote(noteToEdit.content);
        }
    };

    const deleteNote = (id: number) => {
        const updatedNotes = notes.filter((note) => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setEditingNote(null); // Exit edit mode after deletion
    };

    const cancelEdit = () => {
        setEditingNote(null);
        setCreatingNewNote(false);
        setCurrentNote("");
        setCurrentTitle("");
    };

    const getFilteredNotes = () => {
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        const oneMonth = 30 * oneDay;

        switch (filter) {
            case "Today":
                return notes.filter((note) => now - note.timestamp < oneDay);
            case "This Week":
                return notes.filter((note) => now - note.timestamp < oneWeek);
            case "This Month":
                return notes.filter((note) => now - note.timestamp < oneMonth);
            default:
                return notes;
        }
    };

    const filteredNotes = getFilteredNotes();

    const handleNoteClick = (note: any) => {
        setSelectedNote(note); // Set the selected note to display full content
    };

    const closeNoteView = () => {
        setSelectedNote(null); // Close the full note view
    };

    useEffect(() => {
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    return (
        <div
            className="flex gap-4 justify-start"
            style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            {/* Sidebar Component */}
            <Sidebar />

            {/* Main Content Container */}
            <div className="flex-1 p-6 lg:p-10 rounded-l-3xl shadow-lg flex flex-col" style={{ backgroundColor: "#F6F6F6", marginLeft: "-10px" }}>
                <h1 className="text-2xl font-bold mb-1">MyNotes</h1>

                {/* Sort Buttons */}
                <div className="flex space-x-2 mb-0 my-3">
                    <button onClick={() => setFilter("All")} className={`px-4 py-2 rounded-md ${filter === "All" ? "bg-[#657F83] text-white" : "bg-gray-200"}`}>All</button>
                    <button onClick={() => setFilter("Today")} className={`px-4 py-2 rounded-md ${filter === "Today" ? "bg-[#657F83] text-white" : "bg-gray-200"}`}>Today</button>
                    <button onClick={() => setFilter("This Week")} className={`px-4 py-2 rounded-md ${filter === "This Week" ? "bg-[#657F83] text-white" : "bg-gray-200"}`}>This Week</button>
                    <button onClick={() => setFilter("This Month")} className={`px-4 py-2 rounded-md ${filter === "This Month" ? "bg-[#657F83] text-white" : "bg-gray-200"}`}>This Month</button>
                </div>

                {/* Notes Editor */}
                {editingNote !== null || creatingNewNote ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative mb-4 my-5">
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
                            <button onClick={saveNote} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                                {editingNote ? "Save Changes" : "Save Note"}
                            </button>
                        </div>
                    </div>
                ) : selectedNote ? (
                    <div className="bg-white p-6 rounded-lg shadow-lg relative mb-4 my-5">
                        <h2 className="text-lg font-semibold">{selectedNote.title}</h2>
                        <button onClick={closeNoteView} className="absolute top-3 right-5 text-red-500 hover:text-red-700">Close</button>
                        <div className="mt-4">
                            <ReactQuill value={selectedNote.content} readOnly={true} theme="snow" />
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 overflow-x-auto"> {/* Added scroll if content exceeds width */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            <div className="p-6 border rounded-3xl cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center " onClick={() => setCreatingNewNote(true)} style={{ minHeight: "240px", maxWidth: "320px", backgroundColor: "#F9F9F9" }}>
                                <PlusCircle size={28} className="mr-2" /><span>Create New Note</span>
                            </div>

                            {/* New "Upload File" Container */}
                            <div className="p-6 border rounded-3xl cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center" style={{ minHeight: "240px", maxWidth: "320px", backgroundColor: "#F9F9F9" }}>
                                <Upload size={28} className="mr-2" /><span>Upload File</span>
                            </div>

                            {filteredNotes.length === 0 ? (
                                <p className="text-gray-500">No notes available.</p>
                            ) : (
                                filteredNotes.map((note) => (
                                    <div key={note.id} className="p-5 border rounded-3xl shadow-lg hover:shadow-xl relative cursor-pointer" style={{ minHeight: "240px", maxWidth: "320px", backgroundColor: note.color }} onClick={() => handleNoteClick(note)}>
                                        <h4 className="text-xs text-gray-500">{note.createdDate}</h4>
                                        <h3 className="font-bold text-lg mt-2 mb-1">{note.title}</h3>
                                        <hr className="border-t border-black mb-2"/>
                                        <p className="text-gray-700">{note.content.slice(0, 10)}...</p>
                                        <p className="text-sm text-gray-500 absolute bottom-2 left-2">{note.createdTime}</p>
                                        
                                        {/* Edit Icon */}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); editNote(note.id); }} 
                                            className="absolute top-10 right-5 text-black hover:text-[#719191]"
                                        >
                                            <FilePen size={28} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;
