const express = require("express");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const rooms = require("./rooms");

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(cors());

app.get("/", (req, res) => { res.sendStatus(200) });
app.get("/check/:roomId", (req, res) => {
    if (rooms.doesRoomExist(req.params["roomId"])) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
app.post("/create-game", (req, res) => { res.send(rooms.createRoom(io)); });

module.exports = {
    server,
};

// what info does a client need?
// - whether they are good or bad
// - what cards they have
// - whether or not its their turn
// - whether or not the game is over
// - how many defuses have been revealed
// - what round it is?
// - name of the other players connected

// when do they need this information?
// - when they connect to the game
// - when the game starts
// - when a card is revealed

// what happens at the start of a round?
// - cards are delt to each player

// what happens at the end of the round?
// - cards are taken from the players hand

// what happens when the game is over?
// - if your bad your screen turns red, if good then green
// - each player has the option to start a new game
