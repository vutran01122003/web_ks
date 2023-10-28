const RowService = require('../services/row.service');
const UploadService = require('../services/upload.service');

class RowControllers {
    addRow = async (req, res, next) => {
        try {
            const { rowList, rowItemId } = await RowService.addRow({ data: req.body });

            const uploadedImages = await UploadService.uploadImageFromFiles({
                files: req.files,
                data: req.body,
                rowListId: rowList._id
            });

            const addProofImages = await RowService.addProofImages({
                data: req.body,
                uploadedImages,
                rowListId: rowList._id,
                rowItemId
            });

            res.status(200).json({
                status: 'Thêm Thông Tin Thành Công',
                data: rowList
                // uploadedImages
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

module.exports = new RowControllers();
