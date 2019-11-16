const _ = require("lodash");
const constants = require("./constants");
const utils = require("./utils");

test("right number of good and bad in 4 players", () => {
    const players = utils.getNumberOfGoodAndBadPlayers(4);
    expect(players.good).toBeGreaterThanOrEqual(2);
    expect(players.good).toBeLessThanOrEqual(3);
    expect(players.bad).toBeGreaterThanOrEqual(1);
    expect(players.bad).toBeLessThanOrEqual(2);
    expect(players.good + players.bad).toBe(4);
});

test("right number of good and bad in 5 players", () => {
    const players = utils.getNumberOfGoodAndBadPlayers(5);
    expect(players.good).toBe(3);
    expect(players.bad).toBe(2);
    expect(players.good + players.bad).toBe(5);
});

test("right number of good and bad in 6 players", () => {
    const players = utils.getNumberOfGoodAndBadPlayers(6);
    expect(players.good).toBe(4);
    expect(players.bad).toBe(2);
    expect(players.good + players.bad).toBe(6);
});

test("right number of good and bad in 7 players", () => {
    const players = utils.getNumberOfGoodAndBadPlayers(7);
    expect(players.good).toBeGreaterThanOrEqual(4);
    expect(players.good).toBeLessThanOrEqual(5);
    expect(players.bad).toBeGreaterThanOrEqual(2);
    expect(players.bad).toBeLessThanOrEqual(3);
    expect(players.good + players.bad).toBe(7);
});

test("right number of good and bad in 8 players", () => {
    const players = utils.getNumberOfGoodAndBadPlayers(8);
    expect(players.good).toBe(5);
    expect(players.bad).toBe(3);
    expect(players.good + players.bad).toBe(8);
});

test("right number of wires", () => {
    for (let i = constants.MIN_NUM_PLAYERS; i <= constants.MAX_NUM_PLAYERS; i++) {
        const wires = utils.getNumberOfWires(i);
        expect(wires.defuse).toBe(i);
        expect(wires.bomb).toBe(1);
        expect(wires.dud).toBe(i * constants.NUM_CARDS_STARTING_ROUND - 1 - wires.defuse);
    }
});

test("wire numbers to list", () => {
    const types = {
        defuse: 0,
        dud: 0,
        bomb: 0,
    };
    const numWires = utils.getNumberOfWires(6);
    const wires = utils.wireNumbersToList(numWires);
    _.each(wires, wire => { types[wire] += 1 });
    expect(types.defuse).toBe(numWires.defuse);
    expect(types.dud).toBe(numWires.dud);
    expect(types.bomb).toBe(numWires.bomb);
});

test("correct key decremented", () => {
    expect(utils.randomlyDecrementValueForKey({})).toStrictEqual([{}, undefined]);

    const mapWithNoValues = {
        "x": 0,
        "y": 0,
        "z": 0,
    };
    expect(utils.randomlyDecrementValueForKey(mapWithNoValues)).toStrictEqual([mapWithNoValues, undefined]);

    const mapWithOneValue = {
        "x": 0,
        "y": 1,
        "z": 0,
    };
    expect(utils.randomlyDecrementValueForKey(mapWithOneValue)).toStrictEqual([mapWithNoValues, "y"]);

    const filledMap = {
        "x": 4,
        "y": 3,
        "z": 5,
    };
    const [outputMap, outputKey] = utils.randomlyDecrementValueForKey(filledMap);

    for (let key in filledMap) {
        if (key === outputKey) {
            expect(filledMap[key] - 1).toBe(outputMap[key]);
        } else {
            expect(filledMap[key]).toBe(outputMap[key]);
        }
    }
});
