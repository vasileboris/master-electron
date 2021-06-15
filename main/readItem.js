const { BrowserWindow } = require('electron');

module.exports = (url, callback) => {
    let offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    offscreenWindow.loadURL(url);

    offscreenWindow.webContents.on('did-finish-load', e=> {
        let title = offscreenWindow.getTitle();
        offscreenWindow.webContents.capturePage().then(image => {
            let screenshot = image.toDataURL();
            callback({ title, screenshot, url });
            offscreenWindow.close();
        })
    })
}