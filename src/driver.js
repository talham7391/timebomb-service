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
        const connectedPlayers = this.getConnectedPlayers();
        this.game = g.createGame(connectedPlayers.length);
        let idx = 0;
        for (let i in connectedPlayers) {
            this.players[connectedPlayers[i]].index = idx;
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
            defusesFound: this.game.revealedWires.defuse,
        };
    }

    getPlayerInfo(name) {
        if (this.game == null) {
            return null;
        }

        const idx = this.players[name].index;

        return {
            index: idx,
            data: idx != null ? this.game.players[idx] : null,
        };
    }

    snipWire(name, index) {
        if (this.game == null) {
            return;
        }
        return this.game.snipPlayerWireIndex(this.players[name].index, index);
    }

    getWinningSideIfGameOver() {
        if (this.game.isGameOver()) {
            return this.game.whoWon();
        }
        return null;
    }


}

module.exports = Driver;
