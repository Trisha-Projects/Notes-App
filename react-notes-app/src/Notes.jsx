import { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Notes({
  darkMode,
  toggleTheme
}) 
{

  const BASE_URL = "http://localhost:3001";

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [notes, setNotes] = useState([]);
 

  useEffect(() => {

    fetch(
      `${BASE_URL}/api/notes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((err) => console.log(err));

  }, []);

  async function saveNote() {

    if (
      title === "" ||
      content === ""
    ) {
      toast.warning(
        "Fill all fields"
      );
      return;
    }

    const newNote = {
      title,
      content,
    };

    if (editIndex === null) {

      const res = await fetch(
        `${BASE_URL}/api/notes`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            newNote
          ),
        }
      );

      if (!res.ok) {
        toast.error(
          "Unable to Save Note"
        );
        return;
      }

      const data =
        await res.json();

      setNotes([
        ...notes,
        data,
      ]);

      toast.success(
        "Note Added Successfully"
      );

    }

    else {

      const res = await fetch(
        `${BASE_URL}/api/notes/${editIndex}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            newNote
          ),
        }
      );

      if (!res.ok) {
        toast.error(
          "Update Failed"
        );
        return;
      }

      setNotes(
        notes.map((note) =>
          note.id === editIndex
            ? {
                ...note,
                title,
                content,
              }
            : note
        )
      );

      setEditIndex(null);

      toast.info(
        "Note Updated Successfully"
      );

    }

    setTitle("");
    setContent("");

  }

  async function deleteNote(id) {

    const res = await fetch(
      `${BASE_URL}/api/notes/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {

      toast.error(
        "Delete Failed"
      );

      return;

    }

    setNotes(
      notes.filter(
        (note) =>
          note.id !== id
      )
    );

    toast.success(
      "Note Deleted Successfully"
    );

  }

  function editNote(id) {

    const note =
      notes.find(
        (n) =>
          n.id === id
      );

    if (note) {

      setTitle(
        note.title
      );

      setContent(
        note.content
      );

      setEditIndex(id);

    }

  }


  function logout() {

    localStorage.removeItem(
      "token"
    );

    window.location.href = "/";

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
      {darkMode
        ? "☀ Light"
        : "🌙 Dark"}
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
              setTitle(
                e.target.value
              )
            }
            className="title"
          />

          <textarea
            placeholder="✍️ Write your note..."
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
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
      setSearch(
        e.target.value
      )
    }
    className="search"
  />

</div>

        <div className="savednotes">

          {
            filteredNotes.map(
              (note) => (

                <div
                  key={note.id}
                  className="note-card"
                >

                  <h3>
                    {note.title}
                  </h3>

                  <ul>

                    {
                      note.content
                        .split("\n")
                        .map(
                          (
                            line,
                            i
                          ) => (

                            <li
                              key={i}
                            >
                              {line}
                            </li>

                          )
                        )
                    }

                  </ul>

                  <div className="btn-grp">

                    <button
                      onClick={() =>
                        editNote(
                          note.id
                        )
                      }
                      className="edit-btn"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        deleteNote(
                          note.id
                        )
                      }
                      className="delete-btn"
                    >
                      🗑️
                    </button>

                  </div>

                </div>

              )
            )
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