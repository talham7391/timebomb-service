const _ = require("lodash");
const players = require("./players");

test("create players", () => {
    expect(() => { players.createPlayers(-1) }).toThrow();
    expect(() => { players.createPlayers(0) }).toThrow();

    const numPlayers = 4;
    const expected = _.map(_.range(numPlayers), () => ({ role: null, wires: [] }));
    expect(players.createPlayers(numPlayers)).toStrictEqual(expected);
});

test("correct roles are being assigned", () => {
    expect(() => { players.assignRoles([], {"good": 1}) }).toThrow();

    let inputPlayers = [{}, {}, {}];
    let config = {"good": 3, "bad": 0};
    expect(players.assignRoles(inputPlayers, config)).toStrictEqual([{role: "good"}, {role: "good"}, {role: "good"}]);

    inputPlayers = [{}, {}];
    config = {"good": 1, "bad": 1};
    const outputPlayers = players.assignRoles(inputPlayers, config);
    let numGood = 0;
    let numBad = 0;
    _.each(outputPlayers, player => {
        if (player.role === "good") {
            numGood += 1;
        } else if (player.role === "bad") {
            numBad += 1;
        }
    });
    expect(numGood).toBe(1);
    expect(numBad).toBe(1);
});

test("revealed wires are collected properly", () => {
    expect(players.collectRevealedWires([])).toStrictEqual([{}, []]);

    const inputPlayers = [{
        wires: [{
            type: "defuses",
            revealed: false,
        }, {
            type: "duds",
            revealed: true,
        }, {
            type: "duds",
            revealed: true,
        }],
    }, {
        wires: [{
            type: "bomb",
            revealed: true,
        }],
    }];

    const expectedPlayers = [{
        wires: [{
            type: "defuses",
            revealed: false,
        }],
    }, {
        wires: [],
    }];

    const expectedWires = {
        duds: 2,
        bomb: 1,
    };

    expect(players.collectRevealedWires(inputPlayers)).toStrictEqual([expectedWires, expectedPlayers]);
});

test("wires are redistributed properly", () => {
    expect(players.redistributeWires([])).toStrictEqual([]);

    const onePlayer = [{
        wires: [{ type: "defuses", revealed: false }],
    }];
    expect(players.redistributeWires(onePlayer)).toStrictEqual(onePlayer);

    const multiplePlayers = [{
        wires: [
            { type: "defuses" },
            { type: "duds" },
        ],
    }, {
        wires: [
            { type: "bomb" },
            { type: "duds" },
        ],
    }];
    const output = players.redistributeWires(multiplePlayers);

    const numBombs = _.reduce(output, (result, player) => result + _.reduce(player.wires, (result, wire) => result + (wire.type === "bomb" ? 1 : 0), 0), 0);
    const numDefuses = _.reduce(output, (result, player) => result + _.reduce(player.wires, (result, wire) => result + (wire.type === "defuses" ? 1 : 0), 0), 0);
    const numDuds = _.reduce(output, (result, player) => result + _.reduce(player.wires, (result, wire) => result + (wire.type === "duds" ? 1 : 0), 0), 0);

    expect(numBombs).toBe(1);
    expect(numDefuses).toBe(1);
    expect(numDuds).toBe(2);
});
