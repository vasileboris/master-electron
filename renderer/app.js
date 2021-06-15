// Modules
const { ipcRenderer } = require('electron');
const items = require('./items');

// Dom nodes
let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');

const toggleModalButtons = () => {
    if(addItem.disabled) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

//Show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

const addNewItem = newItemUrl => {
    ipcRenderer.send('new-item', newItemUrl);
    toggleModalButtons();
}

addItem.addEventListener('click', e => {
    if(itemUrl.value) {
        addNewItem(itemUrl.value);
    }
})

itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Enter' && itemUrl.value) {
        addNewItem(itemUrl.value);
    }
})

ipcRenderer.on('new-item-success', (e, newItem) => {
    items.addItem(newItem, true);
    toggleModalButtons();
    modal.style.display = 'none';
    itemUrl.value = '';
})
