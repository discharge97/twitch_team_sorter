
//var teams = [];
let team1;
let team2;
let team3;
let team4;
let team1PlayerControls = { index: 0, intervalID: -1 };
let team2PlayerControls = { index: 0, intervalID: -1 };
let team3PlayerControls = { index: 0, intervalID: -1 };
let team4PlayerControls = { index: 0, intervalID: -1 };
const teams = [
    {
        team_name: "Team1",
        players: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a11', 'a12', 'a13', 'a14', 'a15', 'a16', 'a17', 'a18', 'a19']
    },
    {
        team_name: "Team2",
        players: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b11', 'b12', 'b13', 'b14', 'b15', 'b16', 'b17', 'b18', 'b19']
    },
    {
        team_name: "Team3",
        players: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']
    },
    {
        team_name: "Team4",
        players: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9']
    },
];

// ipcRenderer.on("data.render", (event, data) => {
//     teams = data;
//     showTeamData();
// });
// ipcRenderer.on("data.shuffle", (event, data) => {
//     teams = data;
//     shufflePlayersAnimation();
// });

showTeamData();



function showTeamData() {
    updateTargetTeams();
    resetPlayerControlsData();
    for (let i = 0; i < teams.length; i++) {
        switch (i) {
            case 0:
                team1.innerHTML = getTeamPlayersHTML(teams[i].players);
                team1.classList.add("show-me");
                team1PlayerControls.intervalID = setInterval(async () => {
                    document.getElementById(teams[i].players[team1PlayerControls.index++ % (teams[i].players.length - 1)]).scrollIntoView(true);
                    if (team1PlayerControls.index + 10 >= teams[i].players.length - 1) {
                        team1PlayerControls.index = 0;
                    }
                }, 750);
                break;

            case 1:
                team2.innerHTML = getTeamPlayersHTML(teams[i].players);
                team2.classList.add("show-me");
                team2PlayerControls.intervalID = setInterval(async () => {
                    document.getElementById(teams[i].players[team2PlayerControls.index++ % (teams[i].players.length - 1)]).scrollIntoView(true);
                    if (team2PlayerControls.index + 10 >= teams[i].players.length - 1) {
                        team2PlayerControls.index = 0;
                    }
                }, 740);
                break;

            case 2:
                team3.innerHTML = getTeamPlayersHTML(teams[i].players);
                team3.classList.add("show-me");
                team3PlayerControls.intervalID = setInterval(async () => {
                    document.getElementById(teams[i].players[team3PlayerControls.index++ % (teams[i].players.length - 1)]).scrollIntoView(true);
                    if (team3PlayerControls.index + 10 >= teams[i].players.length - 1) {
                        team3PlayerControls.index = 0;
                    }
                }, 730);
                break;

            case 3:
                team4.innerHTML = getTeamPlayersHTML(teams[i].players);
                team4.classList.add("show-me");
                team4PlayerControls.intervalID = setInterval(() => {
                    document.getElementById(teams[i].players[team4PlayerControls.index++ % (teams[i].players.length - 1)]).scrollIntoView(true);
                    if (team4PlayerControls.index + 10 >= teams[i].players.length - 1) {
                        team4PlayerControls.index = 0;
                    }
                }, 720);
                break;
        }
    }
}

function getTeamPlayersHTML(players) {
    let tmp = "";
    players.forEach(player => {
        tmp += `<li id="${player}">${player}</li>`;
    });
    return tmp;
}

function updateTargetTeams() {
    if (!team1 || !team2 || !team3 || !team4) {
        team1 = document.getElementById('team1');
        team2 = document.getElementById('team2');
        team3 = document.getElementById('team3');
        team4 = document.getElementById('team4');
    }
}

function shufflePlayersAnimation() {
    updateTargetTeams();
    const intervalID = setInterval(() => {
        setRandomPlayerNames();

    }, 100);

    setTimeout(() => {
        clearInterval(intervalID);
        showTeamData();
    }, 2000);

}

function setRandomPlayerNames() {
    for (let i = 0; i < teams.length; i++) {
        switch (i) {
            case 0:
                team1.innerHTML = getRandomList(teams[i].players.length);
                break;

            case 1:
                team2.innerHTML = getRandomList(teams[i].players.length);
                break;

            case 2:
                team3.innerHTML = getRandomList(teams[i].players.length);
                break;

            case 3:
                team4.innerHTML = getRandomList(teams[i].players.length);
                break;
        }
    }

}

function getRandomList(num) {
    let tmp = "";
    for (let i = 0; i < num; i++) {
        tmp += `<li>${randomString()}</li>`;
    }
    return tmp;

}

function randomString() {
    let string = "";
    for (i = 0; i < getRandomNumber(9, 15); i++) {
        string += String.fromCharCode(getRandomNumber(35, 125));
    }
    return string;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function resetPlayerControlsData() {
    clearInterval(team1PlayerControls.intervalID);
    clearInterval(team2PlayerControls.intervalID);
    clearInterval(team3PlayerControls.intervalID);
    clearInterval(team4PlayerControls.intervalID);
    team1PlayerControls = { index: 0, intervalID: -1 };
    team2PlayerControls = { index: 0, intervalID: -1 };
    team3PlayerControls = { index: 0, intervalID: -1 };
    team4PlayerControls = { index: 0, intervalID: -1 };
}