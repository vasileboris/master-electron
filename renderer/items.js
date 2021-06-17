const fs = require('fs');

let items = document.getElementById('items');

let readerJs;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJs = data.toString();
})

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

window.addEventListener('message', e=> {
    if(e.data.action === 'delete-reader-item') {
        this.delete(e.data.itemIndex)
        e.source.close();
    }
});

exports.delete = itemIndex => {
    items.removeChild(items.childNodes[itemIndex]);
    this.storage.splice(itemIndex, 1);
    this.save();
    if(this.storage.length) {
        let newSelectedItemIndex = itemIndex ? itemIndex - 1 : 0;
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}

exports.getSelectedItem = () => {
    let currentItem = document.getElementsByClassName('read-item selected')[0];
    let itemIndex = 0;
    let previousItem = currentItem;
    while((previousItem = previousItem.previousElementSibling) != null) {
        itemIndex++
    }
    return {
        node: currentItem,
        index: itemIndex
    }
}

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.select = e => {
    this.getSelectedItem().node.classList.remove('selected');
    e.currentTarget.classList.add('selected');
}

exports.changeSelection = direction => {
    let readItems = document.getElementsByClassName('read-item');
    if(readItems.length === 0) {
        return;
    }

    let currentItem = this.getSelectedItem();
    if(!currentItem) {
        return;
    }

    let nextItem = null;
    if(direction === 'ArrowUp') {
        nextItem = currentItem.node.previousElementSibling ? currentItem.node.previousElementSibling : readItems[readItems.length - 1];
    }
    if(direction === 'ArrowDown') {
        nextItem = currentItem.node.nextElementSibling ? currentItem.node.nextElementSibling : readItems[0];
    }

    if(nextItem){
        currentItem.classList.remove('selected');
        nextItem.classList.add('selected')
    }
}

exports.open = () => {
    if(!this.storage.length) {
        return;
    }

    let selectedItem = this.getSelectedItem();

    let contextUrl = selectedItem.node.dataset.url;

    let readerWindow = window.open(contextUrl, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `);
    readerWindow.eval(readerJs.replace('{{index}}', selectedItem.index))
}

exports.addItem = (item, isNew) => {
    let itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'read-item');
    itemNode.setAttribute('data-url', item.url);
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;
    itemNode.addEventListener('click', this.select);
    itemNode.addEventListener('dblclick', this.open);

    items.appendChild(itemNode);
    if(document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    if(isNew) {
        this.storage.push(item);
        this.save();
    }
}

this.storage.forEach(item => {
   this.addItem(item);
});