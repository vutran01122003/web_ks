const rowService = require('../services/row.service');

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const rowList = await rowService.addRow(req.body);

            res.status(200).json({
                status: 'Thêm Thông Tin Thành Công',
                data: rowList
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RowControllers();
