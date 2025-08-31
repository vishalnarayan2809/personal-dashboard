
import { updateTimeAndGreeting } from './time.js';

const nameModal = document.getElementById('name-modal');
const nameForm = document.getElementById('name-form');
const nameInput = document.getElementById('name-input');

export function handleName() {
    const userName = localStorage.getItem('userName');
    if (!userName) {
        nameModal.style.display = 'flex';
    }
}

export function setupNameForm() {
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userName = nameInput.value.trim();
        if (userName) {
            localStorage.setItem('userName', userName);
            updateTimeAndGreeting();
            nameModal.style.display = 'none';
        }
    });
}
