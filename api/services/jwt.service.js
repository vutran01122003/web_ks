const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = process.env;

class JwtService {
    static signAccessToken = async ({ userId }) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { userId },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1h'
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                }
            );
        });
    };

    static verifyAccessToken = async (accessToken) => {
        try {
            const data = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            return data;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = JwtService;
