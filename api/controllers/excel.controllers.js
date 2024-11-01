const excelService = require("../services/excel.service");

class ExcelController {
    exportUserQualified = async (req, res, next) => {
        try {
            const workbook = await excelService.exportUserQualified();

            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

            workbook.xlsx
                .write(res)
                .then(() => {
                    if (!res.headersSent) {
                        res.status(200).end();
                    }
                })
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            next(error);
        }
    };

    importUser = async (req, res, next) => {
        try {
            await excelService.importUser(req);

            res.status(200).json({
                status: 200,
                msg: "Thêm sinh viên mới thành công"
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ExcelController();
