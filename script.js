let titleInput = document.getElementById("title");
let contentInput = document.getElementById("content");
let saveBtn = document.getElementById("saveBtn");
let notesList = document.getElementById("notesList");
let searchInput = document.getElementById("search");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = null;
showNotes();
saveBtn.addEventListener(
    "click",
    function(){
        let title = titleInput.value;
        let content = contentInput.value;

        if(
            title === "" || content === ""
        ){
            alert("Fill all fields");
            return;
        }

        if(editIndex === null){

            let note = {
                title:title,
                content:content
            };

            notes.push(note);

        }else{

            notes[editIndex].title =
            title;

            notes[editIndex].content =
            content;

            editIndex = null;

            saveBtn.innerText ="Save Note";}

        localStorage.setItem("notes", JSON.stringify(notes));

        titleInput.value = "";
        contentInput.value = "";

        showNotes();
    }
);

function showNotes(){

    notesList.innerHTML = "";

    notes.forEach(function(note,index){

        notesList.innerHTML += `

        <div class="note">

            <h3>${note.title}</h3>

            <p>${note.content.replace(/\n/g, "<br>")}</p>

            <button
            onclick="editNote(${index})">
            Edit
            </button>

            <button
            onclick="deleteNote(${index})">
            Delete
            </button>

        </div>

        `;
    });
}

function deleteNote(index){

    notes.splice(index,1);

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

    showNotes();
}

function editNote(index){

    titleInput.value =
    notes[index].title;

    contentInput.value =
    notes[index].content;

    editIndex = index;

    saveBtn.innerText =
    "Update Note";
}

searchInput.addEventListener(
    "keyup",
    function(){

        let text =
        searchInput.value.toLowerCase();

        let filteredNotes =
        notes.filter(function(note){

            return note.title
            .toLowerCase()
            .includes(text);

        });

        notesList.innerHTML = "";

        filteredNotes.forEach(
        function(note){

            notesList.innerHTML += `

            <div class="note">

                <h3>${note.title}</h3>

                <p>${note.content}</p>

            </div>

            `;
        });
    }
);