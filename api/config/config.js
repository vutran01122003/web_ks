const DEV = {
    app: {
        port: process.env.DEV_APP_PORT,
        clientDomain: process.env.DEV_CLIENT_DOMAIN,
        uri_base: process.env.DEV_APP_URI_BASE
    },
    morganType: "dev",
    mongodb: {
        uri: process.env.DEV_MONGODB_URI
    },
    redis: {
        uri: process.env.DEV_REDIS_URI
    }
};

const PRO = {
    app: {
        port: process.env.PRO_APP_PORT,
        clientDomain: process.env.PRO_CLIENT_DOMAIN,
        uri_base: process.env.PRO_APP_URI_BASE
    },
    morganType: "tiny",
    mongodb: {
        uri: process.env.PRO_MONGODB_URI
    },
    redis: {
        uri: process.env.PRO_REDIS_URI
    }
};

const config = { DEV, PRO };
const env = process.env.NODE_ENV || "DEV";

module.exports = config[env];
