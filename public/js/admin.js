var io = io();
const RUNNING = 1;
const STOPPED = 0;
var gameState = STOPPED;
var max_teams = 2;
var teamsNumber = document.getElementById("teams-count");
var startButton = document.getElementById("start-button");
var stopButton = document.getElementById("stop-button");
var shufflePlayersButton = document.getElementById("shuffle-players-button");
var shuffleTeamsButton = document.getElementById("shuffle-teams-button");
var randomWinnerButton = document.getElementById("random-winner-button");
var teams = [
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

io.on("data.player", data => {
    console.log(data);
    if (!isRunning()) return;

    teams[emptiestTeam()].players.push(data);
    renderTeams();
});

function teamNumberChange() {
    max_teams = teamsNumber.value;
}
function startGame() {
    if (isRunning()) return;
    setGameState(RUNNING);

    for (let i = 1; i <= max_teams; i++) {
        teams.push({ team_name: `Team ${i}`, players: [] });
    }
    renderTeams();
}
function forceStop() {
    setGameState(STOPPED);
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

        tmp += `<ul id="team${i + 1}"><li class="header">
        <input id="txt-team-${i + 1}" type="text" value="${teams[i].team_name || "Team " + (i + 1)}">
        <button onclick="saveTeamName(${i}, 'txt-team-${i + 1}')"><span class="material-icons">save</span> </button>
        </li><li>Move to <select id="move-all-${i}" onchange="moveAllPlayers(${i}, 'move-all-${i}')">${options}</select>
        <button onClick="setWinnerTeam(${i})"><span class="material-icons">emoji_events</span></button> </li>`;

        for (let j = 0; j < teams[i].players.length; j++) {
            tmp += `<li><select id="move-${i}-${j}" onchange="movePlayer('${teams[i].players[j]}',${i},'move-${i}-${j}')">${options}</select> ${teams[i].players[j]}</li>`;
        }

        tmp += `</ul>`;
    }

    document.getElementById("teams").innerHTML = tmp;
    // sendPlayerData();
    io.emit('data.render', teams);
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

function moveAllPlayers(currentTeamIndex, selectDestinationID) {
    if (!isRunning()) return;

    const destTeamIndex = document.getElementById(selectDestinationID).value;

    if (destTeamIndex < 0 || +destTeamIndex === currentTeamIndex) return;

    teams[destTeamIndex].players.push(...teams[currentTeamIndex].players);

    teams[currentTeamIndex].players.length = 0;
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

    io.emit("data.shuffle", teams);

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

function setGameState(state) {
    switch (state) {
        case RUNNING:
            startButton.disabled = true;
            stopButton.disabled = false;
            shufflePlayersButton.disabled = false;
            shuffleTeamsButton.disabled = false;
            teamsNumber.disabled = true;
            randomWinnerButton.disabled = false;
            document.getElementById("winner-box").className = "hide-me";
            gameState = RUNNING;
            io.emit('play.game', true);
            break;
        case STOPPED:
            startButton.disabled = false;
            stopButton.disabled = true;
            shufflePlayersButton.disabled = true;
            shuffleTeamsButton.disabled = true;
            teamsNumber.disabled = false;
            randomWinnerButton.disabled = true;
            gameState = STOPPED;
            io.emit('force.stop', true);
            break;
    }
}

function setWinnerTeam(index) {
    const winner = teams[index];
    io.emit("winner", teams[i]);
    forceStop();
    renderWinnerTeam(winner);
}

function setRandomWinner() {
    setWinnerTeam(getRandomNumber(0, teams.length));
}

function renderWinnerTeam(team) {
    const txtWinningTeam = document.getElementById("winning-team");
    document.getElementById("winner-box").className = "";
    txtWinningTeam.value = `Winning team: ${team.team_name}\n\n${team.players.join("\n")}`;
}
