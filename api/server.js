require("dotenv").config();
const { Server } = require("socket.io");
const socket = require("./services/socket.service");
const app = require("./app");
const {
    app: { port, clientDomain }
} = require("./config/config");

const server = app.listen(port, () => {
    console.log("Server is listening on port", port);
});

// Initial Socket.io
global._io = new Server(server, {
    cors: {
        origin: "*"
    }
});

global.routerStack = app._router.stack;

_io.on("connection", socket.connect);
