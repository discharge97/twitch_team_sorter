const express = require('express');
const tmi = require('tmi.js');
const fs = require('fs');
const cors = require('cors')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
let http = require("http");
let gameState = 0;
const config = JSON.parse(fs.readFileSync('config.json'));

let playerList = [];

const options = {
    options: {
        debug: false
    },
    connection: {
        cluster: 'aws',
        reconnect: true,
    },
    identity: {
        username: config.twitch.channel,
        password: config.twitch.oAuth
    },
    channels: [config.twitch.channel]
};
io.set('origins', '*:*');
const TW_client = new tmi.client(options);

app.use(cors());
app.use('/', express.static(path.join(process.cwd(), "public")));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('', (_, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});
app.get('/admin', (_, res) => {
    res.sendFile(path.join(process.cwd(), "public", "admin.html"));
});

io.on('connection', client => {
    console.log(`Client ${client.id} connected!`);

    client.on('data.render', data => {
        try {
            io.emit("data.render", data);
        } catch (e) {
            console.error(e.message);
        }
    });
    client.on('data.shuffle', data => {
        try {
            io.emit("data.shuffle", data);
        } catch (e) {
            console.error(e.message);
        }
    });
    client.on('force.stop', data => {
        gameState = 0;
        try {
            io.emit("force.stop", data);
            TW_client.action(config.twitch.channel, config.game.stoppedMsg);
        } catch (e) {
            console.error(e.message);
        }
    });
    client.on('play.game', data => {
        gameState = 1;
        try {
            TW_client.action(config.twitch.channel, `${config.game.startedMsg} ${config.twitch.commandPrefix}${config.game.command}`);
        } catch (e) {
            console.error(e.message);
        }
    });
    client.on('winner', data => {
        TW_client.action(config.twitch.channel, `${config.game.winnerMsg} ${data.team_name}. LUL ${data.players.join(',')}`);
        io.emit("force.stop", data);
    });
});

function handleCommand(channel, username, message) {
    const cmdParts = message.match(/([^\s]+)/g);

    switch (cmdParts[0].toLowerCase()) {
        case "play":
            if (gameState === 0) {
                TW_client.action(config.twitch.channel, `${config.game.notStartedMsg}`);
                return;
            }
            if (playerList.includes(username)){
                TW_client.action(config.twitch.channel, `${config.game.alreadyJoined}`);
                return;
            }else{
                io.emit("data.player", username);
                TW_client.action(config.twitch.channel, `${username} ${config.game.joinMsg}`);
            }
            break;

        default:
            // client.action("Unknown command");
            break;
    }
}

TW_client.on('connected', (adress, port) => {
    if (config.twitch.showJoinMessage) {
        TW_client.action(config.twitch.channel, config.twitch.joinMessage);
    }
}).on('message', (channel, tags, message, self) => {
    try {
        if (self) return;

        if (message.startsWith(config.twitch.commandPrefix)) {
            handleCommand(channel, tags.username, message.replace(config.twitch.commandPrefix, ""));
        }
    } catch (err) {
        console.error(err);
    }
});

try {
    TW_client.connect();

    server.listen(3333, () => console.log(`Server started at http://localhost:3333`));
} catch (err) {
    console.error(err);
}
