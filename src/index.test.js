const axios = require("axios");
const io = require("socket.io-client");
const { server } = require("./server");

function _getServiceUrl() {
    return "http://localhost:3000";
}

beforeAll(() => {
    server.listen(3000);
});

test("health check", async () => {
    const res = await axios.get(_getServiceUrl());
    expect(res.status).toBe(200);
});

test("can connect to created game", async done => {
    const res = await axios.post(`${_getServiceUrl()}/create-game`);
    expect(res.status).toBe(200);

    const id = res.data;

    const socket = io.connect(`${_getServiceUrl()}/${id}`);
    socket.on("connect", () => {
        socket.close();
        done();
    });
});

afterAll(() => {
    server.close();
});