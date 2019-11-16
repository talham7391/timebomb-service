const _ = require("lodash");
const constants = require("./constants");
const game = require("./game");

test("game creation", () => {
    expect(() => { game.createGame(constants.MIN_NUM_PLAYERS - 1) }).toThrow();
    const g = game.createGame(5);
    expect(g.playerIndexWithSnips).toBeGreaterThanOrEqual(0);
    expect(g.playerIndexWithSnips).toBeLessThan(5);
    expect(g.revealedWires).toStrictEqual({
        bomb: 0,
        dud: 0,
        defuse: 0,
    });
    expect(g.currentRound).toBe(1);
});

test("game over when bomb revealed", () => {
    const g = game.createGame(4);
    expect(g.isGameOver()).toBe(false);
    g.revealedWires.bomb = 1;
    expect(g.isGameOver()).toBe(true);
});

test("can reveal player's wires", () => {
    const g = game.createGame(4);
    g.playerIndexWithSnips = 0;

    expect(() => { g.snipPlayerWire(4) }).toThrow();
    expect(() => { g.snipPlayerWire(0) }).toThrow();

    const wireType = g.snipPlayerWire(1);
    expect(g.revealedWires[wireType]).toBe(1);
    expect(g.playerIndexWithSnips).toBe(1);

    const typesRevealed = _.filter(g.players[1].wires, wire => wire.revealed);
    expect(typesRevealed.length).toBe(1);
    expect(typesRevealed[0].type).toBe(wireType);
});

test("cannot snip wires once game is over", () => {
    const g = game.createGame(4);
    g.playerIndexWithSnips = 0;
    g.revealedWires.bomb = 1;
    expect(() => { g.snipPlayerWire(1) }).toThrow();
});

test("test cannot snip wires if player has no hidden wires", () => {
    const g = game.createGame(4);
    g.playerIndexWithSnips = 0;
    g.players[1].wires = [{type: "dud", revealed: true}];
    expect(() => { g.snipPlayerWire(1) }).toThrow();
});