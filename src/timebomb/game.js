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
        revealedWires: {},
        currentRound: 1,
    };
}

module.exports = {
    createGame,
};