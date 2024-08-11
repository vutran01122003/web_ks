const createError = require('http-errors');
const UserService = require('../services/user.service');

class UserControllers {
    updateUserActivityStatusByMajor = async (req, res, next) => {
        try {
            const { major, cohort } = req.body;

            await UserService.updateUserActivityStatusByMajor(req.body);

            res.status(200).json({
                status: 200,
                msg: `Kết thúc hoạt động nộp minh chứng của sinh viên khóa ${cohort} ngành ${major}`
            });
        } catch (error) {
            next(error);
        }
    };

    addGroupForUser = async (req, res, next) => {
        try {
            const { groupId, userId } = req.params;

            const updatedUser = await UserService.addGroupForUser({ groupId, userId });

            res.status(200).json({
                msg: 'Thêm chức vụ cho người dùng thành công',
                status: 200,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    };

    getUserByUserId = async (req, res, next) => {
        try {
            const userId = req.params.userId;

            const user = await UserService.getUserByUserId({ userId });

            res.status(200).json({
                msg: 'Lấy dữ liệu người dùng thành công',
                status: 200,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    getUsers = async (req, res, next) => {
        try {
            const { limit, page, cohort, major, userId, status, sortByName } = req.query;

            const users = await UserService.getUsersByFields({
                fields: {
                    cohort: parseInt(cohort),
                    major,
                    isActive: status ? status === 'true' : undefined,
                    userId: userId ? { $regex: userId } : undefined
                },
                queryString: {
                    limit,
                    page
                },
                sort: {
                    firstName: parseInt(sortByName)
                }
            });

            res.status(200).json({
                msg: 'Lấy danh sách người dùng thành công',
                status: 200,
                data: users
            });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const { password, ...userData } = req.body.userData;

            if (Object.keys(userData).some((key) => userData[key] === ''))
                throw createError.BadRequest('Vui lòng nhập đầy đủ thông tin');

            const updatedUser = await UserService.updateUser({ password, userId, userData });

            res.status(200).json({
                msg: 'Cập nhật thông tin người dùng thành công',
                status: 200,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new UserControllers();
