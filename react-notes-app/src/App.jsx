import { useState, useEffect } from "react";

function App() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [notes, setNotes] = useState(() => { const savedNotes = localStorage.getItem("notes");
  return savedNotes ? JSON.parse(savedNotes) : []; });

  useEffect(() => {localStorage.setItem("notes", JSON.stringify(notes) );}, [notes]);

  function saveNote() {

    if (title === "" || content === "") {
      alert("Fill all fields");
      return;
    }

    const newNote = {title,content };
    
    if (editIndex === null) {
      setNotes([...notes, newNote]);
    } else {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = newNote;
      setNotes(updatedNotes);
      setEditIndex(null);
    }

    setTitle("");
    setContent("");
  }

  function deleteNote(index) {

    const updatedNotes =
      notes.filter(
        (note, i) => i !== index
      );

    setNotes(updatedNotes);
  }

  function editNote(index) {

    setTitle(notes[index].title);

    setContent(
      notes[index].content
    );

    setEditIndex(index);
  }

  const filteredNotes =
    notes.filter((note) =>
      note.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div style={{
      width: "80%",
      margin: "auto",
      padding: "20px"
    }}>

      <h1>Notes App</h1>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <textarea
        placeholder="Enter Content"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          height: "100px",
          marginBottom: "10px"
        }}
      />

      <button
        onClick={saveNote}
        style={{
          padding: "10px 20px"
        }}
      >
        {editIndex === null
          ? "Save Note"
          : "Update Note"}
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Search Notes"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px"
        }}
      />

      <br /><br />

      {filteredNotes.map(
        (note, index) => (

        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >

          <h3>{note.title}</h3>

          <p>{note.content}</p>

          <button
            onClick={() =>
              editNote(index)
            }
          >
            Edit
          </button>

          <button onClick={() => deleteNote(index)
            }
            style={{
              marginLeft: "10px"
            }}
          >
            Delete
          </button>

        </div>

      ))}
    </div>
  );
}

export default App;