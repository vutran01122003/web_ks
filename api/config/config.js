const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 4000,
        clientDomain_v1: process.env.DEV_CLIENT_DOMAIN_V1,
        clientDomain_v2: process.env.DEV_CLIENT_DOMAIN_V2,
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

const pro = {
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
        port: process.env.PRO_REDIS_PORT,
        host: process.env.PRO_REDIS_HOST
    }
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
