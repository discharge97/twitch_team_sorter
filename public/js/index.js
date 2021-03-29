var io = io();
var teams = [];
var team1;
var team2;
var team3;
var team4;
var scrollInterval = -1;
scrollAnimation();
io.on("data.render", data => {
    if (data) {
        teams = data;
        showTeamData();
    }
});

io.on("force.stop", data => {
    clearInterval(scrollInterval);
    window.location.reload(true);
});

io.on("data.shuffle", data => {
    if (data) {
        teams = data;
        shufflePlayersAnimation();
    }
});

function showTeamData() {
    updateTargetTeams();
    resetPlayerControlsData();
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
    teamPlayerControlIndexes = [0, 0, 0, 0];
}

function scrollAnimation() {

    scrollInterval = setInterval(() => {
        if (team1) {
            if (team1.scrollTop + team1.offsetHeight >= team1.scrollHeight) {
                team1.scrollTop = 0;
            } else {
                team1.scrollTop += 26;
            }
        }
        if (team2) {
            if (team2.scrollTop + team2.offsetHeight >= team2.scrollHeight) {
                team2.scrollTop = 0;
            } else {
                team2.scrollTop += 26;
            }
        }
        if (team3) {
            if (team3.scrollTop + team3.offsetHeight >= team3.scrollHeight) {
                team3.scrollTop = 0;
            } else {
                team3.scrollTop += 26;
            }
        }
        if (team4) {
            if (team4.scrollTop + team4.offsetHeight >= team4.scrollHeight) {
                team4.scrollTop = 0;
            } else {
                team4.scrollTop += 26;
            }
        }

    }, 1500);
}
