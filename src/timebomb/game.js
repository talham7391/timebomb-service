const _ = require("lodash");
const constants = require("./constants");
const errors = require("./errors");
const players = require("./players");
const utils = require("./utils");

function createGame(numPlayers) {
    if (numPlayers < constants.MIN_NUM_PLAYERS || numPlayers > constants.MAX_NUM_PLAYERS) {
        throw errors.INVALID_NUM_PLAYERS;
    }

    let p = players.createPlayers(numPlayers);
    const playersConfig = utils.getNumberOfGoodAndBadPlayers(numPlayers);
    p = players.assignRoles(p, playersConfig);

    const wiresConfig = utils.getNumberOfWires(numPlayers);
    p = players.distributeWires(p, wiresConfig);

    return {
        players: p,
        playerIndexWithSnips: Math.floor(Math.random() * p.length),
        revealedWires: {
            bomb: 0,
            dud: 0,
            defuse: 0,
        },
        currentRound: 1,

        isGameOver,
        snipPlayerWire,
    };
}

function isGameOver() {
    return this.revealedWires.bomb === 1;
}

function snipPlayerWire(playerIndex) {
    if (playerIndex < 0 || playerIndex >= this.players.length) {
        throw errors.PLAYER_INDEX_OUT_OF_RANGE;
    }
    if (this.playerIndexWithSnips === playerIndex) {
        throw errors.CANNOT_SNIP_OWN_WIRES;
    }
    if (this.isGameOver()) {
        throw errors.GAME_OVER;
    }

    const revealedWires = _.filter(this.players[playerIndex].wires, wire => wire.revealed);
    const hiddenWires = _.filter(this.players[playerIndex].wires, wire => !wire.revealed);
    if (hiddenWires.length === 0) {
        throw errors.ALL_PLAYER_WIRES_REVEALED;
    }

    const revealIndex = Math.floor(Math.random() * hiddenWires.length);
    hiddenWires[revealIndex].revealed = true;
    this.players[playerIndex].wires = revealedWires.concat(hiddenWires);

    this.revealedWires[hiddenWires[revealIndex].type] += 1;
    this.playerIndexWithSnips = playerIndex;

    return hiddenWires[revealIndex].type;
}

module.exports = {
    createGame,
};
