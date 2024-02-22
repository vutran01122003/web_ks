const UserService = require('../services/user.service');

class UserControlers {
    updateUserActivityStatusByMajor = async (req, res, next) => {
        try {
            const updatedUsers = await UserService.updateUserActivityStatusByMajor(req.body);

            res.status(200).json({
                msg: updatedUsers.msg
            });
        } catch (error) {
            next(error);
        }
    };

    updateTask;
}

module.exports = new UserControlers();
