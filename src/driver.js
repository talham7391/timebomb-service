const g = require("./timebomb/game");

class Driver {

    constructor() {
        this.game = null;
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

    startGame() {
        this.game = g.createGame(Object.keys(this.players).length);
        let idx = 0;
        for (let name in this.players) {
            this.players[name].index = idx;
            idx++;
        }
    }

    getGameState() {
        if (this.game == null) {
            return null;
        }

        return {
            currentRound: this.game.currentRound,
            playerIndexWithSnips: this.game.playerIndexWithSnips,
        };
    }

    getPlayerInfo(name) {
        if (this.game == null) {
            return null;
        }

        const idx = this.players[name].index;

        return {
            index: idx,
            data: this.game.players[idx],
        };
    }
}

module.exports = Driver;
