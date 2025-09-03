const noteContainer = document.getElementById('custom-note-container');
const noteText = document.getElementById('note-text');
const noteInput = document.getElementById('note-input');

const placeholder = "add a custom note";

function loadNote() {
    const savedNote = localStorage.getItem('customNote');
    if (savedNote && savedNote.trim() !== "") {
        noteText.textContent = savedNote;
        noteText.classList.remove('placeholder');
    } else {
        noteText.textContent = placeholder;
        noteText.classList.add('placeholder');
    }
}

function enterEditMode() {
    const currentNote = noteText.textContent === placeholder ? "" : noteText.textContent;
    noteInput.value = currentNote;
    noteText.style.display = 'none';
    noteInput.style.display = 'block';
    noteInput.focus();
}

function exitEditMode() {
    const newNote = noteInput.value.trim();
    localStorage.setItem('customNote', newNote);
    
    if (newNote) {
        noteText.textContent = newNote;
        noteText.classList.remove('placeholder');
    } else {
        noteText.textContent = placeholder;
        noteText.classList.add('placeholder');
    }

    noteText.style.display = 'block';
    noteInput.style.display = 'none';
}

export function setupNote() {
    loadNote();

    noteContainer.addEventListener('click', () => {
        if (noteInput.style.display === 'none') {
            enterEditMode();
        }
    });

    noteInput.addEventListener('blur', exitEditMode);

    noteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            exitEditMode();
        }
    });
}
