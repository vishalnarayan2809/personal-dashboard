
const quickLinksContainer = document.getElementById("recent-pages");
const modal = document.getElementById('link-modal');
const form = document.getElementById('link-form');
let links = [];
let editingIndex = null;

function renderLinks() {
    quickLinksContainer.innerHTML = '';
    links.forEach((link, index) => {
        const container = document.createElement('div');
        container.className = 'page-icon-container';

        const pageLink = document.createElement('a');
        pageLink.href = link.url;
        pageLink.title = link.name;
        pageLink.className = 'page-icon';
        pageLink.target = '_blank';

        const pageIcon = document.createElement('img');
        pageIcon.src = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(link.url).hostname}`;
        pageIcon.alt = link.name;
        pageIcon.onerror = () => { pageIcon.src = './assets/icon.png'; };

        const actions = document.createElement('div');
        actions.className = 'page-actions';

        const editButton = document.createElement('button');
        editButton.innerHTML = '&#9998;';
        editButton.onclick = (e) => {
            e.preventDefault();
            openModal(index);
        };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.onclick = (e) => {
            e.preventDefault();
            deleteLink(index);
        };

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        pageLink.appendChild(pageIcon);
        container.appendChild(pageLink);
        container.appendChild(actions);
        quickLinksContainer.appendChild(container);
    });

    if (links.length < 10) {
        const addButton = document.createElement('button');
        addButton.id = 'add-link-button';
        addButton.textContent = '+';
        addButton.onclick = () => openModal();
        quickLinksContainer.appendChild(addButton);
    }
}

function openModal(index = null) {
    editingIndex = index;
    if (index !== null) {
        form['link-name'].value = links[index].name;
        form['link-url'].value = links[index].url;
    } else {
        form.reset();
    }
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
    form.reset();
    editingIndex = null;
}

function saveLinks() {
    localStorage.setItem('customLinks', JSON.stringify(links));
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

export function loadLinks() {
    const savedLinks = localStorage.getItem('customLinks');
    if (savedLinks) {
        links = JSON.parse(savedLinks);
    } else {
        links = [
            { name: 'Google', url: 'https://google.com' },
            { name: 'GitHub', url: 'https://github.com' }
        ];
    }
    renderLinks();
}

export function setupLinkEditor() {
    // Get the close button specifically from the link modal
    const closeButton = modal.querySelector('.close-button');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form['link-name'].value;
        const url = form['link-url'].value;

        if (editingIndex !== null) {
            links[editingIndex] = { name, url };
        } else {
            links.push({ name, url });
        }
        
        saveLinks();
        renderLinks();
        closeModal();
    });

    // Handle close button click
    if (closeButton) {
        closeButton.onclick = closeModal;
    }
    
    // Handle clicking outside the modal
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}
