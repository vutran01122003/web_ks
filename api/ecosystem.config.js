module.exports = {
    apps: [
        {
            name: "TEMS",
            script: "server.js",
            instances: 4,
            autorestart: true,
            watch: true,
            max_memory_restart: "1G"
        }
    ]
};
