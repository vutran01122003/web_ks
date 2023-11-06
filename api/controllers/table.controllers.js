const createError = require('http-errors');
const TableService = require('../services/table.service');
const Page = require('../models/page.model');

class TableControllers {
    addTable = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền tạo chỉ tiêu');

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
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền tạo xóa chỉ tiêu');

            const { pageId, tableId } = req.body;

            const removedTable = await TableService.removeTable({ pageId, tableId });

            res.status(201).json({
                msg: removedTable.status,
                page: removedTable.page,
                status: removedTable.status
            });
        } catch (error) {
            next(error);
        }
    };

    updateTable = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ cập nhật chỉ tiêu');

            const { pageId, tableId, tableData } = req.body;

            const updatedTable = await TableService.updatedTable({ pageId, tableId, tableData });

            res.status(200).json({
                status: updatedTable.status,
                page: updatedPage.page,
                msg: 'Cập nhật chỉ tiêu thành công'
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new TableControllers();
