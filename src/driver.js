const game = require("./timebomb/game");

class Driver {

    constructor() {
        // this.timebomb = game.createGame();
        this.players = {};
    }

    connectPlayer(name) {
        if (this.players[name] == null) {
            this.players[name] = {
                index: null,
                connected: null,
            };
        }
        this.players[name].connected = true;
        return this.getConnectedPlayers();
    }

    disconnectPlayer(name) {
        if (this.players[name] != null) {
            this.players[name].connected = false;
        }
        return this.getConnectedPlayers();
    }

    getConnectedPlayers() {
        const p = [];
        for (let name in this.players) {
            if (this.players.hasOwnProperty(name) && this.players[name].connected) {
                p.push(name);
            }
        }
        return p;
    }
}

module.exports = Driver;
