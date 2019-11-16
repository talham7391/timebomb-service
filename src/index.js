const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketio(server);

server.listen(3000);

app.get("/", (req, res) => { res.send("Hello, World!"); });

io.on("connection", socket => {
    socket.emit("message", "Hello, World!");
});
