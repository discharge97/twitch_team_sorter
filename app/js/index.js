const {ipcRenderer} = require('electron');

function test() {
    ipcRenderer.send('data.send', {cmd: "test"});
}

ipcRenderer.on("data.get", (event, data) => {
    console.log(data);
});
