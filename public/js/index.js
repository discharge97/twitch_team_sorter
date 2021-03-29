var io = io();
var teams = [];
var team1;
var team2;
var team3;
var team4;
var teamPlayerControlIndexes = [0, 0, 0, 0];
var scrollInterval = -1;

io.on("data.render", data => {
    if (data){
        teams = data;
        showTeamData();
    }
});

io.on("force.stop", data => {
    resetPlayerControlsData();
    clearInterval(scrollInterval);
    showTeamData();
});

io.on("data.shuffle", (event, data) => {
    if (data){
        teams = data;
        shufflePlayersAnimation();
    }
});

function showTeamData() {
    updateTargetTeams();
    resetPlayerControlsData();
    team1.innerHTML = "";
    team2.innerHTML = "";
    team3.innerHTML = "";
    team4.innerHTML = "";

    for (let i = 0; i < teams.length; i++) {
        switch (i) {
            case 0:
                team1.innerHTML = getTeamPlayersHTML(teams[i].players);
                team1.classList.add("show-me");
                break;

            case 1:
                team2.innerHTML = getTeamPlayersHTML(teams[i].players);
                team2.classList.add("show-me");
                break;

            case 2:
                team3.innerHTML = getTeamPlayersHTML(teams[i].players);
                team3.classList.add("show-me");
                break;

            case 3:
                team4.innerHTML = getTeamPlayersHTML(teams[i].players);
                team4.classList.add("show-me");
                break;
        }
    }

    scrollInterval = setInterval(() => {
        for (let i = 0; i < teams.length; i++) {
            document.getElementById(teams[i].players[teamPlayerControlIndexes[i]++ % (teams[i].players.length - 1)]).scrollIntoView(true);
            if (teamPlayerControlIndexes[i] + 10 >= teams[i].players.length - 1) {
                teamPlayerControlIndexes[i] = 0;
            }
        }
    }, 1000);
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
    clearInterval(scrollInterval);
    teamPlayerControlIndexes = [0, 0, 0, 0];
}
