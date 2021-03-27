const {app, BrowserWindow, ipcMain} = require('electron');
const shell = require('shelljs');
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

ipcMain.on('data.send', (event, arg) => {
    console.log(arg);

	appWindow.webContents.send('data.get', {test: "hi"});
    })
});

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
