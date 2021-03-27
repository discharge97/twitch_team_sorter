const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const io = require('socket.io')();
// io.on('connection', client => { ... });

let appWindow = undefined;
const createWindow = () => {
    appWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });

    appWindow.loadFile('./app/admin.html').then(() => {
    });
};

// ipcMain.on('data.send', (event, arg) => {
//     appWindow.webContents.send('data.player', {username: "test_username"});
// });
ipcMain.on('data.render', (event, arg) => {
    // appWindow.webContents.send('data.player', {username: "test_username"});
    console.log(arg);
});

app.whenReady().then(() => {
    createWindow();
    io.listen(3333, () => console.log("Socket.io started on port 3333"));
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
