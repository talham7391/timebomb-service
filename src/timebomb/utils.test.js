const constants = require("./constants");
const {
    getNumberOfGoodAndBadPlayers,
    getNumberOfWires,
} = require("./utils");

test("right number of good and bad in 4 players", () => {
    const players = getNumberOfGoodAndBadPlayers(4);
    expect(players.good).toBeGreaterThanOrEqual(2);
    expect(players.good).toBeLessThanOrEqual(3);
    expect(players.bad).toBeGreaterThanOrEqual(1);
    expect(players.bad).toBeLessThanOrEqual(2);
    expect(players.good + players.bad).toBe(4);
});

test("right number of good and bad in 5 players", () => {
    const players = getNumberOfGoodAndBadPlayers(5);
    expect(players.good).toBe(3);
    expect(players.bad).toBe(2);
    expect(players.good + players.bad).toBe(5);
});

test("right number of good and bad in 6 players", () => {
    const players = getNumberOfGoodAndBadPlayers(6);
    expect(players.good).toBe(4);
    expect(players.bad).toBe(2);
    expect(players.good + players.bad).toBe(6);
});

test("right number of good and bad in 7 players", () => {
    const players = getNumberOfGoodAndBadPlayers(7);
    expect(players.good).toBeGreaterThanOrEqual(4);
    expect(players.good).toBeLessThanOrEqual(5);
    expect(players.bad).toBeGreaterThanOrEqual(2);
    expect(players.bad).toBeLessThanOrEqual(3);
    expect(players.good + players.bad).toBe(7);
});

test("right number of good and bad in 8 players", () => {
    const players = getNumberOfGoodAndBadPlayers(8);
    expect(players.good).toBe(5);
    expect(players.bad).toBe(3);
    expect(players.good + players.bad).toBe(8);
});

test("right number of wires", () => {
    for (let i = constants.MIN_NUM_PLAYERS; i <= constants.MAX_NUM_PLAYERS; i++) {
        const wires = getNumberOfWires(i);
        expect(wires.defuses).toBe(i);
        expect(wires.bomb).toBe(1);
        expect(wires.duds).toBe(i * constants.NUM_CARDS_STARTING_ROUND - 1 - wires.defuses);
    }
});
