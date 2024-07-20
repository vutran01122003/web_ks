const createError = require('http-errors');
const TableService = require('../services/table.service');
const PageService = require('../services/page.service');

class TableControllers {
    getTable = async (req, res, next) => {
        try {
            const { pageId, tableId } = req.query;
            const page = await PageService.getPageById({ page: pageId });

            const table = await page.tables.id(tableId);

            res.status(200).json({
                table,
                status: 200,
                msg: 'Lấy dữ liệu bảng thành công'
            });
        } catch (error) {
            next(error);
        }
    };

    addTable = async (req, res, next) => {
        try {
            const { pageId, tables } = req.body;
            const addedTable = await TableService.addTable({ pageId, tables });

            res.status(201).json({
                msg: addedTable.msg,
                page: addedTable.page,
                status: addedTable.status
            });
        } catch (error) {
            next(error);
        }
    };

    removeTable = async (req, res, next) => {
        try {
            const { pageId, tableId } = req.body;

            const removedTable = await TableService.removeTable({ pageId, tableId });

            res.status(201).json({
                msg: removedTable.msg,
                page: removedTable.page,
                status: removedTable.status
            });
        } catch (error) {
            next(error);
        }
    };

    updateTable = async (req, res, next) => {
        try {
            const { pageId, table } = req.body;
            const updatedTable = await TableService.updateTable({ pageId, table });

            res.status(200).json({
                status: updatedTable.status,
                msg: 'Cập nhật chỉ tiêu thành công'
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

module.exports = new TableControllers();
