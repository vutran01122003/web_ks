const client = require("../dbs/init.redis");

class SocketService {
    connect = (socket) => {
        socket.on("handshake", ({ userId }) => {
            client.set(`socketId:${userId}`, socket.id);
            socket.on("disconnect", () => {
                client.del(`socketId:${userId}`);
            });
        });
    };
}

module.exports = new SocketService();
