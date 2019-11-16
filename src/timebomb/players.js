const _ = require("lodash");
const utils = require("./utils");
const errors = require("./errors");

function createPlayers(numPlayers) {
    if (numPlayers <= 0) {
        throw errors.INVALID_NUM_PLAYERS;
    }
    return _.map(_.range(numPlayers), () => ({
        role: null,
        wires: [],
    }));
}

function assignRoles(players, playerConfig) {
    const playersInConfig = _.reduce(playerConfig, (result, value, key) => result + value, 0);
    if (players.length !== playersInConfig) {
        throw errors.INCONSISTENT_NUM_PLAYERS;
    }

    let config = _.cloneDeep(playerConfig);
    const randomlyTakeFromConfig = () => {
        [config, key] = utils.randomlyDecrementValueForKey(config);
        return key;
    };

    return _.map(players, player => ({
        ...player,
        role: randomlyTakeFromConfig(),
    }));
}

function collectRevealedWires(players) {
    const revealedWires = {};
    const newPlayers = _.map(players, player => {
        const revealed = _.filter(player.wires, wire => wire.revealed);
        const notRevealed = _.filter(player.wires, wire => !wire.revealed);
        _.each(revealed, wire => {
            if (revealedWires[wire.type] == undefined) {
                revealedWires[wire.type] = 1;
            } else {
                revealedWires[wire.type] += 1;
            }
        });
        return {
            ...player,
            wires: notRevealed,
        };
    });
    return [revealedWires, newPlayers];
}

function distributeWires(players, wiresConfig) {
    const numWires = _.reduce(wiresConfig, (result, value) => result + value, 0);
    const wiresPerPlayer = numWires / players.length;
    return _.map(players, player => ({
        ...player,
        wires: _.map(_.range(wiresPerPlayer), () => {
            [wiresConfig, type] = utils.randomlyDecrementValueForKey(wiresConfig);
            return {
                type,
                revealed: false,
            };
        }),
    }));
}

function redistributeWires(players) {
    let wiresConfig = {};
    _.each(players, player => {
        _.each(player.wires, wire => {
            if (wiresConfig[wire.type] == undefined) {
                wiresConfig[wire.type] = 1;
            } else {
                wiresConfig[wire.type] += 1;
            }
        });
    });

    return distributeWires(players, wiresConfig);
}

module.exports = {
    createPlayers,
    assignRoles,
    collectRevealedWires,
    distributeWires,
    redistributeWires,
};