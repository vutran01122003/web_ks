const express = require("express");
const { MulterError } = require("multer");
const { ValidationError } = require("joi");
const createError = require("http-errors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

require("./dbs/init.redis");
require("./dbs/init.mongodb");

const {
    morganType,
    app: { clientDomain_v1, clientDomain_v2 }
} = require("./config/config");

// CORS config
const whitelist = [clientDomain_v1, clientDomain_v2];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(morganType));
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Router
app.use("/api", require("./router/page"));
app.use("/api", require("./router/access"));
app.use("/api", require("./router/table"));
app.use("/api", require("./router/news"));
app.use("/api", require("./router/row"));
// app.use('/api', require('./router/chat'));
app.use("/api", require("./router/faculty"));
app.use("/api", require("./router/progress"));
app.use("/api", require("./router/excel"));
app.use("/api", require("./router/notification"));
app.use("/api", require("./router/permission"));
app.use("/api", require("./router/user"));

// Catch NotFound
app.use((req, res, next) => {
    throw createError.NotFound();
});

// Catch Error
app.use((err, req, res, next) => {
    if (err instanceof MulterError) {
        let errInfo = {};
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                errInfo = {
                    status: 413,
                    msg: "Kích thước file tối đa là 10MB"
                };
                break;
            case "LIMIT_FILE_COUNT":
                errInfo = {
                    status: 413,
                    msg: "Giới hạn tải lên là 10 files"
                };
                break;
            case "LIMIT_UNEXPECTED_FILE":
                errInfo = {
                    status: 422,
                    msg: "Định dạng file không đúng"
                };
                break;
            default:
                errInfo = {
                    status: 400,
                    msg: "Tải lên các files gặp sự cố"
                };
                break;
        }
        return res.status(errInfo.status).json(errInfo);
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({
            status: 400,
            msg: err.details[0].message,
            path: err.details[0].path
        });
    }

    const statusCode = err?.status || 500;
    const message = err?.message || "Có lỗi xảy ra";

    return res.status(statusCode).json({
        status: statusCode,
        msg: statusCode !== 500 ? message : "Có lỗi hệ thống xảy ra"
    });
});

module.exports = app;
