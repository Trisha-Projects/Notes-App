import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notes({ darkMode, toggleTheme }) {

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showArchive, setShowArchive] = useState(false);

  async function loadNotes() {

    const res = await fetch(
      `${BASE_URL}/api/notes`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setNotes(data);

    setShowArchive(false);

  }

  async function loadArchivedNotes() {

    const res = await fetch(
      `${BASE_URL}/api/notes/archive`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setNotes(data);

    setShowArchive(true);

  }

  useEffect(() => {

    loadNotes();

  }, []);

  async function saveNote() {

    if (title === "" || content === "") {

      toast.warning("Fill all fields");

      return;

    }

    const newNote = {
      title,
      content
    };

    if (editIndex === null) {

      const res = await fetch(
        `${BASE_URL}/api/notes`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(newNote)
        }
      );

      if (!res.ok) {

        toast.error("Unable to Save Note");

        return;

      }

      toast.success("Note Added Successfully");

      loadNotes();

    }

    else {

      const res = await fetch(
        `${BASE_URL}/api/notes/${editIndex}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(newNote)
        }
      );

      if (!res.ok) {

        toast.error("Update Failed");

        return;

      }

      toast.success("Note Updated Successfully");

      setEditIndex(null);

      loadNotes();

    }

    setTitle("");

    setContent("");

  }

  async function pinNote(id, isPinned) {

    const res = await fetch(
      `${BASE_URL}/api/notes/pin/${id}`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {

      toast.error("Unable to Pin");

      return;

    }

   

    if (showArchive) {

      loadArchivedNotes();

    }

    else {

      loadNotes();

    }

  }

  async function archiveNote(id) {

    const res = await fetch(
      `${BASE_URL}/api/notes/archive/${id}`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {

      toast.error("Archive Failed");

      return;

    }

    toast.success(
      showArchive
        ? "Note Restored"
        : "Note Moved To Archive"
    );

    if (showArchive) {

      loadArchivedNotes();

    }

    else {

      loadNotes();

    }

  }

  async function deleteNote(id) {

    const res = await fetch(
      `${BASE_URL}/api/notes/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {

      toast.error("Delete Failed");

      return;

    }

    toast.success("Note Deleted Successfully");

    loadNotes();

  }

  function editNote(id) {

    const note = notes.find(
      (n) => n.id === id
    );

    if (!note) return;

    setTitle(note.title);

    setContent(note.content);

    setEditIndex(id);

  }

  function logout() {

    localStorage.removeItem("token");

    window.location.href = "/";

  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
  <>

    <div
      className={
        darkMode
          ? "container dark"
          : "container light"
      }
    >

      <div className="navbar">

        <h1 className="heading">
          <span>✨</span> KeepNote
        </h1>

        <div className="nav-btns">

          <button
            className="theme-btn"
            onClick={toggleTheme}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

          <button
            className="theme-btn"
            onClick={loadNotes}
          >
            📝 Notes
          </button>

          <button
            className="theme-btn"
            onClick={loadArchivedNotes}
          >
            📦 View Archive
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

      </div>

      <div className="form-card">

        <input
          type="text"
          placeholder="📝 Note Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="title"
        />

        <textarea
          placeholder="✍️ Write your note..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          className="content"
        />

        <button
          onClick={saveNote}
          className="save-btn"
        >
          {
            editIndex === null
              ? "➕ Add Note"
              : "💾 Update Note"
          }
        </button>

      </div>

      <div className="search-card">

        <input
          type="text"
          placeholder="🔍 Search Notes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="search"
        />

      </div>

      <div className="savednotes">

      
 {
  filteredNotes.length === 0 && (

    <div className="empty-state">

     <div className="empty-icon">
  {showArchive ? "📦" : "📝"}
</div>

      <h2>
        {showArchive
          ? "No Archived Notes"
          : "No Notes Found"}
      </h2>

      {showArchive && (
        // <>
        //   <p>Your archived notes will appear here.</p>

          <button
            className="back-notes-btn"
            onClick={loadNotes}
          >
            ← Back to Notes
          </button>
        // </>
      )}

    </div>

  )
}


        {

          filteredNotes.map((note) => (

            <div
              key={note.id}
              className="note-card"
            >

             {/* <h3>{note.title}</h3> */}
             <h3>
 {note.isPinned === 1 && (
  <span className="pinned-icon">📌</span>
)}
  {note.title}
</h3>

              <ul>

                {
                  note.content
                    .split("\n")
                    .map((line, i) => (

                      <li key={i}>
                        {line}
                      </li>

                    ))
                }

              </ul>

              <div className="btn-grp">

                {/* <button
                  onClick={() =>
                    pinNote(note.id, note.isPinned)
                  }
                >
                  {
                    note.isPinned
                      ? "📍 Unpin"
                      : "📌 Pin"
                  }
                </button> */}
<button
  className="icon-btn"
  data-title={note.isPinned ? "Unpin" : "Pin"}
  onClick={() => pinNote(note.id, note.isPinned)}
>
  {note.isPinned ? "📍" : "📌"}
</button>
            
<button
  className="archive-btn"
  data-title={showArchive ? "Restore" : "Archive"}
  onClick={() => archiveNote(note.id)}
>
                  {
                    showArchive
                      ? "📤"
                      : "📦"
                  }
                </button>

                <button
                  className="edit-btn"
                  onClick={() =>
                    editNote(note.id)
                  }
                >
                  ✏️
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteNote(note.id)
                  }
                >
                  🗑️
                </button>

              </div>

            </div>

          ))

        }

      </div>

    </div>

    <ToastContainer
      position="top-right"
      autoClose={2000}
    />

  </>
);

}

export default Notes;