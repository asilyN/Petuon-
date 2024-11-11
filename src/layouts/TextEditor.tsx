import React, { useState } from "react";
import ReactQuill from "react-quill"; // Import ReactQuill for the editor
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const TextEditor: React.FC = () => {
    const [editorValue, setEditorValue] = useState<string>("");

    const handleChange = (value: string) => {
        setEditorValue(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <ReactQuill
                value={editorValue}
                onChange={handleChange}
                theme="snow"
                modules={{
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link'],
                        ['blockquote', 'code-block'],
                        ['image'],
                        ['clean'],
                    ],
                }}
                placeholder="Start writing your notes..."
            />
        </div>
    );
};

export default TextEditor;
