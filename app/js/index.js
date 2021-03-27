
//var teams = [];
let team1;
let team2;
let team3;
let team4;
const teams = [
    {
        team_name: "Team1",
        players: ['aaaa','bbbb','ccccc','ggggg']
    },
    {
        team_name: "Team2",
        players: ['ccccc','ggggg','aaaa','bbbb']
    },
    {
        team_name: "Team3",
        players: ['aaaa','bbbb','ccccc','ggggg']
    },
    {
        team_name: "Team4",
        players: ['aaaa','bbbb','ccccc','ggggg']
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

//showTeamData();

shufflePlayersAnimation();

function showTeamData() {
    updateTargetTeams();

    for (let i = 0; i < teams.length; i++) {
        switch (i) {
            case 0:
                team1.innerHTML = getTeamPlayersHTML(teams[i].players);
                break;

            case 1:
                team2.innerHTML = getTeamPlayersHTML(teams[i].players);
                break;

            case 2:
                team3.innerHTML = getTeamPlayersHTML(teams[i].players);
                break;

            case 3:
                team4.innerHTML = getTeamPlayersHTML(teams[i].players);
                break;
        }
    }
}

function getTeamPlayersHTML(players) {
    let tmp = "";
    players.forEach(player => {
        tmp += `<li>${player}</li>`;
    });
    return tmp;
}

function updateTargetTeams() {
    if (!team1 || !team2 || !team3 || !team4){
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

function setRandomPlayerNames(){
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

function getRandomList(num){
    let tmp = "";
   for(let i = 0;i < num; i++) {
    tmp += `<li>${randomString()}</li>`;
    }
    return tmp;

}

function randomString(){
    let string = ""; 
    for(i = 0; i < getRandomNumber(9,15); i++){
        string += String.fromCharCode(getRandomNumber(35,125));
    }
    return string;
}

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
}