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
};
