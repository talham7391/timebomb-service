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
        whoWon,
        snipPlayerWireIndex,
        _randomlySnipPlayerWire,
        numPlayerWiresRevealed,
    };
}

function isGameOver() {
    if (this.currentRound > constants.MAX_NUM_ROUNDS) {
        return true;
    }
    if (this.revealedWires.defuse === this.players.length) {
        return true;
    }
    return this.revealedWires.bomb === 1;
}

function whoWon() {
    if (!this.isGameOver()) {
        throw errors.GAME_NOT_OVER;
    }
    if (this.currentRound > constants.MAX_NUM_ROUNDS || this.revealedWires.bomb === 1) {
        return "bad";
    }
    return "good";
}

function numPlayerWiresRevealed() {
    let count = 0;
    _.each(this.players, player => {
        const revealedWires = _.filter(player.wires, wire => wire.revealed);
        count += revealedWires.length;
    });
    return count;
}

function _randomlySnipPlayerWire(playerIndex) {
    const hiddenWires = _.filter(this.players[playerIndex].wires, wire => !wire.revealed);
    const revealIndex = Math.floor(Math.random() * hiddenWires.length);
    return this.snipPlayerWireIndex(playerIndex, revealIndex);
}

function snipPlayerWireIndex(playerIndex, wireIndex) {
    if (this.isGameOver()) {
        throw errors.GAME_OVER;
    }
    if (playerIndex < 0 || playerIndex >= this.players.length) {
        throw errors.PLAYER_INDEX_OUT_OF_RANGE;
    }
    if (this.playerIndexWithSnips === playerIndex) {
        throw errors.CANNOT_SNIP_OWN_WIRES;
    }
    if (wireIndex < 0 || wireIndex >= this.players[playerIndex].wires.length ) {
        throw errors.WIRE_INDEX_OUT_OF_RANGE;
    }
    const hiddenWires = _.filter(this.players[playerIndex].wires, wire => !wire.revealed);
    if (hiddenWires.length === 0) {
        throw errors.ALL_PLAYER_WIRES_REVEALED;
    }
    if (this.players[playerIndex].wires[wireIndex].revealed) {
        throw errors.WIRE_ALREADY_REVEALED;
    }

    this.players[playerIndex].wires[wireIndex].revealed = true;
    const wireSnipped = this.players[playerIndex].wires[wireIndex].type;

    this.revealedWires[wireSnipped] += 1;
    this.playerIndexWithSnips = playerIndex;

    if (!this.isGameOver() && this.numPlayerWiresRevealed() === this.players.length) {
        this.currentRound += 1;
        this.players = players.collectRevealedWires(this.players)[1];
        this.players = players.redistributeWires(this.players);
    }

    return wireSnipped;
}

module.exports = {
    createGame,
};
