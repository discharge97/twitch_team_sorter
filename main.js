const {app, BrowserWindow, ipcMain} = require('electron');
const server = require('http-server');
const fs = require('fs')

let appWindow = undefined;
const createWindow = () => {
    appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    appWindow.loadFile('./app/index.html');
};

// ipcMain.on('data.send', (event, arg) => {
//     appWindow.webContents.send('data.player', {username: "test_username"});
// });

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
