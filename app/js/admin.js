const { ipcRenderer } = require('electron');
const RUNNING = 1;
const STOPPED = 0;
let gameState = STOPPED;
let max_teams = 2;
var teamsNumber = document.getElementById("teams-count");
const teams = [
    // {
    //     team_name: "Team1",
    //     players: []
    // },
    // {
    //     team_name: "Team2",
    //     players: []
    // },
    // {
    //     team_name: "Team3",
    //     players: []
    // },
    // {
    //     team_name: "Team4",
    //     players: []
    // },
];

function sendPlayerData() {
    ipcRenderer.send('data.render', teams);
}

ipcRenderer.on("data.player", (event, data) => {
    if (!isRunning()) return;

    console.log(data);
    teams[emptiestTeam()].players.push(data);


});

function teamNumberChange() {
    max_teams = teamsNumber.value;
}
function startGame() {
    if (isRunning()) return;
    gameState = RUNNING;
    teamsNumber.disabled = true;
    for (let i = 1; i <= max_teams; i++) {
        teams.push({ team_name: `Team ${i}`, players: [] });
    }
    renderTeams();
}
function forceStop() {
    gameState = STOPPED;
    teamsNumber.disabled = false;
    max_teams = 2;
    teamsNumber.value = max_teams;
    document.getElementById('teams').innerHTML = "";
    teams.length = 0;

}

function emptiestTeam() {
    let min = 0;
    for (let i = 1; i < teams.length; i++) {
        if (teams[i].players.length < teams[min].players.length)
            min = i;
    }
    return min;
}
function test() {
    if (!isRunning()) return;
    let index = emptiestTeam()
    teams[index].players.push(`data-${Math.random()}`);
    renderTeams()

}

function renderTeams() {
    let tmp = "";
    let options = "<option value='-1'>TEAM</option>";
    let i = 0;
    teams.forEach(team => { options += `<option value="${i++}">${team.team_name}</option>` });

    for (let i = 0; i < max_teams; i++) {

        tmp += `<ul id="team${i + 1}">
        <li class="header">
        <input id="txt-team-${i + 1}" type="text" value="${teams[i].team_name || "Team " + (i + 1)}">
        <button onclick="saveTeamName(${i}, 'txt-team-${i + 1}')"><span class="material-icons">save</span> </button>
        </li>`

        for (let j = 0; j < teams[i].players.length; j++) {
            tmp += `<li><select id="move-${i}-${j}" onchange="movePlayer('${teams[i].players[j]}',${i},'move-${i}-${j}')">${options}</select> ${teams[i].players[j]}</li>`;
        }
        tmp += `</ul>`;
    }

    document.getElementById("teams").innerHTML = tmp;
    sendPlayerData();
}

function saveTeamName(teamIndex, nameID) {
    if (!isRunning()) return;
    teams[teamIndex].team_name = document.getElementById(nameID).value;
    renderTeams();
}

function movePlayer(playerName, currentTeamIndex, selectDestinationID) {
    if (!isRunning()) return;
    const destTeamIndex = document.getElementById(selectDestinationID).value;


    if (destTeamIndex < 0 || +destTeamIndex === currentTeamIndex) return;

    teams[currentTeamIndex].players.splice(teams[currentTeamIndex].players.indexOf(playerName), 1);
    teams[destTeamIndex].players.push(playerName);
    renderTeams();
}


function shufflePlayers() {
    if (!isRunning()) return;
    let all_players = [];
    teams.forEach(team => {
        all_players.push(...team.players);
        team.players.length = 0;
    });

    const avgPlayers = Math.floor(all_players.length / max_teams);
    let i = 0;
    while (all_players.length > 0) {
        teams[i++ % max_teams].players.push(...all_players.splice(getRandomNumber(0, all_players.length), 1));
    }

    renderTeams();
}

function shuffleTeams() {
    if (!isRunning()) return;
    let team_names = [];
    teams.forEach(team => {
        team_names.push(team.team_name);
        team.team_name = "";
    });

    console.log(team_names);

    teams.forEach(team => {
        team.team_name = team_names.splice(getRandomNumber(0, team_names.length), 1)[0];
    });
    // let i = 0;
    // while (team_names.length > 0) {
    //     teams[i++ % max_teams].team_name = team_names.splice(0, getRandomNumber(0, team_names.length));
    // }
    renderTeams();
}


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isRunning() {
    return gameState === RUNNING;
}

function isStopped() {
    return gameState === STOPPED;
}







