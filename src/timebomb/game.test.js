const _ = require("lodash");
const constants = require("./constants");
const game = require("./game");
const utils = require("./utils");

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

test("game over when cuts finished", () => {
    const g = game.createGame(4);
    expect(g.isGameOver()).toBe(false);
    g.currentRound = constants.MAX_NUM_ROUNDS + 1;
    expect(g.isGameOver()).toBe(true);
});

test("game over when defuses found", () => {
    const g = game.createGame(4);
    expect(g.isGameOver()).toBe(false);
    g.revealedWires.defuse = 4;
    expect(g.isGameOver()).toBe(true);
});

test("can reveal player's wires", () => {
    const g = game.createGame(4);
    g.playerIndexWithSnips = 0;

    expect(() => { g.snipPlayerWireIndex(4, 0) }).toThrow();
    expect(() => { g.snipPlayerWireIndex(0, 0) }).toThrow();

    const wireType = g._randomlySnipPlayerWire(1);
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
    expect(() => { g._randomlySnipPlayerWire(1) }).toThrow();
});

test("test cannot snip wires if player has no hidden wires", () => {
    const g = game.createGame(4);
    g.playerIndexWithSnips = 0;
    g.players[1].wires = [{type: "dud", revealed: true}];
    expect(() => { g._randomlySnipPlayerWire(1) }).toThrow();
});

test("number of wires revealed", () => {
    const g = game.createGame(4);
    g.playerIndexWithSnips = 0;
    expect(g.numPlayerWiresRevealed()).toBe(0);
    g._randomlySnipPlayerWire(1);
    expect(g.numPlayerWiresRevealed()).toBe(1);
});

test("sanity by 1000 games", () => {
    _.each(_.range(1000), () => {
        const numPlayers = constants.MIN_NUM_PLAYERS + Math.floor(Math.random() * (constants.MAX_NUM_PLAYERS - constants.MIN_NUM_PLAYERS + 1));
        const g = game.createGame(numPlayers);

        let snipsThisRound = 0;

        while (true) {
            if (g.revealedWires.bomb > 0) {
                expect(g.revealedWires.bomb).toBe(1);
                expect(utils.wiresRevealedOfType(g.players, "bomb")).toBe(1);
                expect(g.isGameOver()).toBeTruthy();
                break;
            }
            if (g.currentRound > constants.MAX_NUM_ROUNDS) {
                expect(g.numPlayerWiresRevealed()).toBe(0);
                expect(g.revealedWires.bomb).toBe(0);
                expect(utils.wiresRevealedOfType(g.players, "defuse")).toBeLessThan(numPlayers);
                expect(g.isGameOver()).toBeTruthy();
                break;
            }

            if (g.revealedWires.defuse === numPlayers) {
                expect(utils.wiresRevealedOfType(g.players, "defuse")).toBeGreaterThan(0);
                expect(g.isGameOver()).toBeTruthy();
                break;
            }

            while (true) {
                const nextSnip = Math.floor(Math.random() * numPlayers);
                try {
                    g._randomlySnipPlayerWire(nextSnip);
                    break;
                } catch(err) {}
            }

            if (!g.isGameOver() && snipsThisRound === numPlayers) {
                expect(g.numPlayerWiresRevealed()).toBe(0);
                const expectedWiresPerPlayer = constants.NUM_CARDS_STARTING_ROUND - g.currentRound + 1;
                _.each(g.players, player => {
                    expect(player.wires.length).toBe(expectedWiresPerPlayer);
                });
                snipsThisRound = 0;
            }
        }
    });
});