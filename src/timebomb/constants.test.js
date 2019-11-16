const constants = require("./constants");

test("enough cards to last max number of rounds", () => {
    expect(constants.NUM_CARDS_STARTING_ROUND - constants.MAX_NUM_ROUNDS).toBeGreaterThanOrEqual(0);
});

test("enough cuts per round", () => {});

test("max players greater than min players", () => {
    expect(constants.MIN_NUM_PLAYERS).toBeLessThanOrEqual(constants.MAX_NUM_PLAYERS);
});