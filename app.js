
function addNote(event) {
    event.preventDefault();
    const data = gatherFormData()
    const newNote = createLine(data)
    injectLineToDOM(newNote)
    saveNotesToStorage(data)
}

function gatherFormData() {
    const paper = document.getElementById('paper').value
    const currentDate = new Date().toLocaleString()
    const dueDate = document.getElementById('due-date').value
    const dueHour = document.getElementById('due-hour').value
    const id = Date.now().toString()
    return { paper, currentDate, dueDate, id, dueHour }
}

function createLine(data) {
    const { paper, currentDate, dueDate, id, dueHour } = data;


    let formattedDate = dueDate;

    const yyyy = dueDate.slice(0, 4);
    const mm = dueDate.slice(5, 7);
    const dd = dueDate.slice(8, 10);
    formattedDate = `${dd}/${mm}/${yyyy}`;

    const newNote = `
         <div class='task-note' id="${id}">
         <div class="top-bar">
            <button class='delete-btn' onclick='deleteNote(${id})'>
                <i class="bi bi-x-lg" style="font-size: 10px; color: black;" ></i>
            </button>
         </div>
            <div id='date-created'> Created at: <br> ${currentDate} </div>
            <div class="note-text">${paper}</div>
            <div class="due-date"> ${formattedDate}<br>${dueHour}</div>
        </div>
 
 `
    return newNote
}

function deleteNote(id) {
    const element = document.getElementById(id);
    if (element) element.remove();

    const notesJSON = localStorage.getItem('notes');
    let notes = JSON.parse(notesJSON) || [];
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
            notes.splice(i, 1);

            break;
        }
    }
    localStorage.setItem('notes', JSON.stringify(notes));
}





function deleteAll() {
    const notesJSON = localStorage.getItem('notes');
    if (notesJSON) {
        localStorage.removeItem('notes');
        document.getElementById('tasks').innerHTML = '';
    } else {
        alert('Nothing to delete.');
    }
}


// this is my solution for making only the note that as been
// submitted fade-in, and not the entire task board.

// the problem is, if we set: tasks.innerHTML = newNote, 
// we delete the entire HTML string, and replace it with a new 
// one, which makes the colossal fade in.
// to solve this, well create a temporary container,
// and we will set the container to the value of newNote.
// then, we will append only the container, and not the entire
// id='tasks' value. kind of like only writing on a single note, and then pinning it.

function injectLineToDOM(newNote) {
    const tasks = document.getElementById('tasks');
    const container = document.createElement('div');
    container.innerHTML += newNote;
    tasks.appendChild(container);

}

// saving and loading from storage

function saveNotesToStorage(note) {
    const notesJSON = localStorage.getItem('notes') || "[]";
    const notes = JSON.parse(notesJSON);
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}


function loadNotesFromStorage() {
    const notesJSON = localStorage.getItem('notes');
    if (notesJSON) {
        const notes = JSON.parse(notesJSON);
        let allNotes = '';
        for (const note of notes) {
            allNotes += createLine(note);
        }

        document.getElementById('tasks').innerHTML = allNotes;
    }
}



// all of the functions that help generating a random note on the task board

function generateRandomNote() {
    const data = {
        paper: generateRandomSentence(),
        currentDate: new Date().toLocaleString(),
        dueDate: generateRandomDueDate(),
        dueHour: `${Math.floor(Math.random() * 24).toString()}:${Math.floor(Math.random() * 60).toString()}`,
        id: Date.now()
    }

    function generateRandomSentence() {
        const sentences = [
            'Buy Some Milk',
            'Replace Light Bulb',
            'Walk the Dog',
            'Finish Homework',
            'Call Mom',
            'Pay Electricity Bill',
            'Clean My Desk',
            'Make Carbonara',
            'Book A Flight',
            'Play Battlefield 1942',
            'Code Mario 64 From Scratch',
            'Book A Play'
        ];

        const randomIndex = Math.floor(Math.random() * sentences.length);
        console.log(randomIndex)
        return sentences[randomIndex];
    }
    // i won't lie here, i relayed strongly on AI's help with this function below.
    // i mostly created the random generator to help with CSS testing, it's 
    // a little buggy and uses more advanced methods, but hey, it's working:)
    function generateRandomDueDate() {
        const today = new Date();
        const randomDaysToAdd = Math.floor(Math.random() * 10) + 1;
        today.setDate(today.getDate() + randomDaysToAdd);

        const yyyy = today.getFullYear();
        const mm = today.getMonth() + 1;
        const dd = today.getDate();

        return `${yyyy}-${mm}-${dd}`
    }


    const newNote = createLine(data);
    injectLineToDOM(newNote);
    saveNotesToStorage(data)
}

// clearing the form
function clearForm() {
    document.getElementById("form").reset();
}


//loading the storage once the site is loaded

loadNotesFromStorage()