const Page = require('../models/page.model');
const createError = require('http-errors');

class TableService {
    static addTable = async ({ pageId, tables }) => {
        try {
            const tableNameList = tables.map((table) => table.tableName);

            const page = await Page.findById(pageId).lean();

            if (!page) throw createError.NotFound('Không tìm thấy page');

            const isExistsTable = await Page.find({
                _id: pageId,
                'tables.tableName': { $in: tableNameList }
            }).lean();

            if (isExistsTable.length > 0) throw createError.Conflict('Tên chỉ tiêu đã tồn tại');

            const updatedPage = await Page.findByIdAndUpdate(
                pageId,
                {
                    $push: {
                        tables: { $each: tables }
                    }
                },
                {
                    new: true
                }
            );

            return {
                msg: 'Thêm chỉ tiêu thành công',
                page: updatedPage,
                status: 201
            };
        } catch (error) {
            throw error;
        }
    };

    static removeTable = async ({ pageId, tableId }) => {
        try {
            const page = await Page.findById(pageId).lean();

            if (!page) throw createError.NotFound('Không tìm thấy page');

            const updatedPage = await Page.findOneAndUpdate(
                { _id: pageId },
                {
                    $pull: {
                        tables: { _id: tableId }
                    }
                },
                {
                    new: true
                }
            );

            return {
                msg: 'Xóa chỉ tiêu thành công',
                page: updatedPage,
                status: 201
            };
        } catch (error) {
            throw error;
        }
    };

    static updateTable = async ({ pageId, tableId, tableData }) => {
        try {
            const page = await Page.findById(pageId).lean();

            if (!page) throw createError.NotFound('Không tìm thấy page');

            const updatedPage = await Page.findOneAndUpdate(
                { _id: pageId, 'tables._id': tableId },
                {
                    $set: {
                        'tables.$.tableName': tableData.tableName,
                        'tables.$.rowTitleList': tableData.rowTitleList
                    }
                },
                { new: true }
            );

            return {
                status: 200,
                page: updatedPage,
                msg: 'Cập nhật chỉ tiêu thành công'
            };
        } catch (error) {
            throw error;
        }
    };
}

module.exports = TableService;
