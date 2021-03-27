const {ipcRenderer} = require('electron');

let max_teams = 4;
const teams = [
    {
        team_name: "Team1",
        players: []
    },
    {
        team_name: "Team2",
        players: []
    },
    {
        team_name: "Team3",
        players: []
    },
    {
        team_name: "Team4",
        players: []
    },
];

function sendData() {
    ipcRenderer.send('data.render', teams);
}

ipcRenderer.on("data.player", (event, data) => {
    console.log(data);
    players.push(data);
});
