require('dotenv').config();
const { Server } = require('socket.io');
const socket = require('./services/socket.service');
const app = require('./app');
const {
    app: { port, clientDomain_v2 }
} = require('./config/config');

const server = app.listen(port, () => {
    console.log('Server is listening on port:::', port);
});

// Initial Socket.io
global._io = new Server(server, {
    cors: {
        origin: clientDomain_v2
    }
});

_io.on('connection', socket.connect);
