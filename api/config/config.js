const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 4000,
        clientDomain_v1: process.env.DEV_CLIENT_DOMAIN_V1 || 'http://localhost:3000',
        clientDomain_v2: process.env.DEV_CLIENT_DOMAIN_V2 || 'http://localhost:3000'
    },
    morganType: 'dev',
    mongodb: {
        port: process.env.DEV_MONGODB_PORT || 27017,
        host: process.env.DEV_MONGODB_HOST || 'localhost',
        database: process.env.DEV_MONGODB_DATABASE || 'dev_database'
    },
    redis: {
        port: process.env.DEV_REDIS_PORT || 6379,
        host: process.env.DEV_REDIS_HOST || '127.0.0.1'
    }
};

const pro = {
    app: {
        port: process.env.PRO_APP_PORT,
        clientDomain: process.env.PRO_CLIENT_DOMAIN
    },
    morganType: 'tiny',
    mongodb: {
        port: process.env.PRO_MONGODB_PORT,
        host: process.env.PRO_MONGODB_HOST,
        database: process.env.PRO_MONGODB_DATABASE
    },
    redis: {
        port: process.env.PRO_REDIS_PORT,
        host: process.env.PRO_REDIS_HOST
    }
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
