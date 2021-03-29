const express = require('express');
const tmi = require('tmi.js');
const fs = require('fs');
const cors = require('cors')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
let http = require("http");

const config = JSON.parse(fs.readFileSync('config.json'));

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
const client = new tmi.client(options);

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
        io.emit("data.render", data);
    });
    client.on('data.shuffle', data => {
        io.emit("data.shuffle", data);
    });
});

function handleCommand(channel, username, message) {
    const cmdParts = message.match(/([^\s]+)/g);

    switch (cmdParts[0].toLowerCase()) {
        case "play":
            io.emit("data.player", username);
            break;

        default:
            // client.action("Unknown command");
            break;
    }
}

client.on('connected', (adress, port) => {
    if (config.twitch.ShowJoinMessage) {
        client.action(config.twitch.Channel, config.twitch.JoinMessage);
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
    // client.connect();

    server.listen(3333, () => console.log(`Server started at http://localhost`));
} catch (err) {
    console.error(err);
}
