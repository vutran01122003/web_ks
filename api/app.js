require('./dbs/init.mongodb');
// require('./dbs/init.redis');
const express = require('express');
const createError = require('http-errors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const {
    morganType,
    app: { clientDomain_v1, clientDomain_v2 }
} = require('./config/config');

const app = express();

// CORS config
const whitelist = [clientDomain_v1, clientDomain_v2];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

// MiddleWare
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(morgan(morganType));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Router
app.use('/api', require('./router/page'));
app.use('/api', require('./router/access'));
app.use('/api', require('./router/table'));

app.get('/setcookie', (req, res) => {
    res.cookie('testCookie', 'magic content');
    res.send('set the cookie');
});

app.get('/readCookie', (req, res) => {
    res.send('your cookies: ' + inspect(req.cookies['testCookie']));
    console.log(req.cookies);
});

// Catch NotFound
app.use((req, res, next) => {
    throw createError.NotFound();
});

// Catch Error
app.use((err, req, res, next) => {
    console.log(err);
    if (err) {
        res.status(err.status).json({
            status: err.status,
            msg: err.msg,
            code: err.code
        });
    }
});

module.exports = app;
