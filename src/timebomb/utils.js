const _ = require("lodash");
const constants = require("./constants");
const errors = require("./errors");

function getNumberOfGoodAndBadPlayers(numPlayers) {
    if (numPlayers < constants.MIN_NUM_PLAYERS || numPlayers > constants.MAX_NUM_PLAYERS) {
        throw errors.INVALID_NUM_PLAYERS;
    }
    const playerMap = {
        4: { good: 2, bad: 1, random: 1 },
        5: { good: 3, bad: 2, random: 0 },
        6: { good: 4, bad: 2, random: 0 },
        7: { good: 4, bad: 2, random: 1 },
        8: { good: 5, bad: 3, random: 0 },
    };
    const config = playerMap[numPlayers];
    const retval = {
        good: config.good,
        bad: config.bad,
    };
    _.each(_.range(config.random), () => {
        const isGood = !!Math.round(Math.random());
        if (isGood) {
            retval.good += 1;
        } else {
            retval.bad += 1;
        }
    });
    return retval;
}

function getNumberOfWires(numPlayers) {
    if (numPlayers < constants.MIN_NUM_PLAYERS || numPlayers > constants.MAX_NUM_PLAYERS) {
        throw errors.INVALID_NUM_PLAYERS;
    }
    const totalNumberOfWires = constants.NUM_CARDS_STARTING_ROUND * numPlayers;
    return {
        defuses: numPlayers,
        bomb: 1,
        duds: totalNumberOfWires - 1 - numPlayers,
    };
}

module.exports = {
    getNumberOfGoodAndBadPlayers,
    getNumberOfWires,
};
