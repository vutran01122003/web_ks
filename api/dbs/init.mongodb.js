const mongoose = require('mongoose');
const {
    mongodb: { port, host, database }
} = require('../config/config');

const uri = `mongodb://${host}:${port}/${database}`;

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        if (process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(uri);

        mongoose.connection.on('connected', function () {
            console.log('Mongodb:::connected:::', this.name);
        });

        mongoose.connection.on('error', function (e) {
            console.log('Mongodb:::error:::', JSON.stringify(e));
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
