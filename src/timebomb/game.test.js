
const game = require("./game");

test("game creation", () => {
    const g = game.createGame(5);
    expect(g.playerIndexWithSnips).toBeGreaterThanOrEqual(0);
    expect(g.playerIndexWithSnips).toBeLessThan(5);
    expect(g.revealedWires).toStrictEqual({});
    expect(g.currentRound).toBe(1);
});
