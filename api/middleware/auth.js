// const client = require('../dbs/init.redis');
const jwtService = require('../services/jwt.service');
const createError = require('http-errors');

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers['x-token'] || req.cookies?.accessToken;
            const data = await jwtService.verifyAccessToken(accessToken);
            res.locals.userId = data.userId;
            // console.log(data.userId);
            next();
        } catch (error) {
            if (['JsonWebTokenError', 'TokenExpiredError'].includes(error.name)) {
                next({ status: 401, code: 401, message: error.message });
            }
            next(error);
        }
    }
};
