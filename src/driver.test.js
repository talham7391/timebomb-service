const Driver = require("./driver");

test("connected players", () => {
    const d = new Driver();
    expect(d.getConnectedPlayers()).toStrictEqual([]);
    expect(d.connectPlayer("Bob")).toStrictEqual(["Bob"]);
    expect(d.connectPlayer("Joe")).toStrictEqual(["Bob", "Joe"]);
    expect(d.disconnectPlayer("Bob")).toStrictEqual(["Joe"]);
    expect(d.disconnectPlayer("Joe")).toStrictEqual([]);
});

// test("updated when player disconnects");