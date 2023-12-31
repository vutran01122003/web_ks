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

    getDynamicRows = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền lấy dữ liệu chỉ tiêu chờ duyệt');

            const { page, limit, current_rows, rows_type } = req.query;

            const userFilterConditions = {
                ['user.major']: req.query?.major ? req.query?.major.toLowerCase() : null,
                ['user.studentId']: req.query?.student_id
                    ? {
                          ['$regex']: new RegExp(`^${req.query?.student_id}`)
                      }
                    : null
            };

            Object.keys(userFilterConditions).forEach((key) => {
                if (!userFilterConditions[key]) delete userFilterConditions[key];
            });

            const peddingRow = await RowService.getDynamicRows({
                page,
                limit,
                userFilterConditions,
                currentRows: current_rows,
                rowsType: rows_type
            });
            res.status(200).json({
                code: peddingRow.code,
                msg: peddingRow.msg,
                data: peddingRow.data
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    updateRowStatus = async (req, res, next) => {
        try {
            if (!res.locals.roles.includes('0004'))
                throw createError.Forbidden('Không đủ quyền cập nhật trạng thái chỉ tiêu');
            const { rowListId, contentIdList, status, noteValue } = req.body;

            const updatedRow = await RowService.updateRowStatus({
                rowListId,
                contentIdList,
                status,
                noteValue
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
