const backgroundModal = document.getElementById('background-modal');
const backgroundSettingsButton = document.getElementById('background-settings-button');
const categoriesContainer = document.getElementById('background-categories');
const closeButton = backgroundModal.querySelector('.close-button');

const categories = ['Nature', 'Travel', 'Architecture', 'Technology', 'Food', 'Art', 'Animals', 'Space'];

function openBackgroundModal() {
    backgroundModal.style.display = 'flex';
    populateCategories();
}

function closeBackgroundModal() {
    backgroundModal.style.display = 'none';
}

function populateCategories() {
    categoriesContainer.innerHTML = '';
    const currentCategory = localStorage.getItem('backgroundImageCategory') || 'Nature';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category;
        if (category.toLowerCase() === currentCategory.toLowerCase()) {
            button.classList.add('selected');
        }
        button.addEventListener('click', () => {
            localStorage.setItem('backgroundImageCategory', category);
            document.querySelector('.category-button.selected').classList.remove('selected');
            button.classList.add('selected');
            // We need to import and call loadBackgroundImage here, but we'll do that from the main script to avoid circular dependencies.
            window.dispatchEvent(new Event('backgroundCategoryChanged'));
            setTimeout(closeBackgroundModal, 300); // Close modal after a short delay
        });
        categoriesContainer.appendChild(button);
    });
}

export function setupBackgroundSettings() {
    backgroundSettingsButton.addEventListener('click', openBackgroundModal);
    closeButton.addEventListener('click', closeBackgroundModal);
    window.addEventListener('click', (event) => {
        if (event.target === backgroundModal) {
            closeBackgroundModal();
        }
    });
}
