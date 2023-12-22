const RowService = require('../services/row.service');
const UploadService = require('../services/upload.service');
const createError = require('http-errors');

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const rowData = JSON.parse(req.body.rowData);
            if (!res.locals.roles.includes('0002'))
                throw createError.Forbidden('Chỉ có kỹ sư tài năng mới thêm được chỉ tiêu');

            const { rowList, rowItemId } = await RowService.addRow({
                data: rowData
            });

            const uploadedFiles = await UploadService.uploadFilesToS3({
                files: req.files,
                folderName: `proof_files/${rowData.faculty}/${rowData.major}/${rowData.cohort}/${rowData.studentId}/${rowData.tableName}`
            });

            await RowService.addProofFiles({
                data: req.body,
                uploadedFiles,
                rowListId: rowList._id,
                rowItemId
            });

            res.status(200).json({
                status: 'Thêm Thông Tin Thành Công'
                // data: rowList
            });
        } catch (error) {
            next(error);
        }
    };

    getPendingRows = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền lấy dữ liệu chỉ tiêu chờ duyệt');

            const { page, limit, current_pedding_rows } = req.query;
            const peddingRow = await RowService.getPendingRows({
                page,
                limit,
                currentPendingRows: current_pedding_rows
            });
            res.status(200).json({
                code: peddingRow.code,
                msg: peddingRow.msg,
                data: peddingRow.data
            });
        } catch (error) {
            next(error);
        }
    };

    updateRowStatus = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền cập nhật trạng thái chỉ tiêu');
            const { rowListId, contentIdList, status } = req.body;

            const updatedRow = await RowService.updateRowStatus({
                rowListId,
                contentIdList,
                status
            });

            res.status(200).json({
                code: updatedRow.code,
                msg: updatedRow.msg
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new RowControllers();
