const _ = require("lodash");
const errors = require("./errors");
const Driver = require("./driver");

const rooms = {};
const availableIds = [];
let init = false;

function createRoom(io) {
    const id = newRoomId();
    const nsp = io.of(`/${id}`);
    rooms[id] = newRoom(id, nsp);
    return id;
}

function doesRoomExist(roomId) {
    return !(rooms[roomId] == null);
}

function newRoomId() {
    if (init === false) {
        const numDigits = 4;
        for (let i in _.range(Math.pow(10, numDigits))) {
            const id = i.toString().padStart(numDigits, '0');
            availableIds.push(id);
        }
        init = true;
    }

    if (availableIds.length === 0) {
        throw errors.SERVER_CAPACITY_REACHED;
    }

    return availableIds.shift();
}

function newRoom(id, nsp) {

    const driver = new Driver();

    nsp.on("connection", socket => {

        let name = null;

        socket.on("set-name", n => {
            name = n;
            nsp.emit("connected-players", driver.connectPlayer(name));
            socket.emit("game-state", driver.getGameState());
            socket.emit("info", driver.getPlayerInfo(name));
        });

        socket.on("start-game", () => {
            driver.startGame();
            nsp.emit("game-started");
        });

        socket.on("new-game", () => {
            driver.reset();
            nsp.emit("new-game");
        });

        socket.on("get-info", () => {
            socket.emit("game-state", driver.getGameState());
            socket.emit("info", driver.getPlayerInfo(name));
        });

        socket.on("snip-wire", (idx, callback) => {
            try {
                callback(null, driver.snipWire(name, idx));
                nsp.emit("wire-snipped");
            } catch(err) {
                callback(err, null);
            }
        });

        socket.on("disconnect", () => {
            if (name != null) {
                nsp.emit("connected-players", driver.disconnectPlayer(name));
            }
        });
    });

    return driver;
}

module.exports = {
    createRoom,
    doesRoomExist,
};
