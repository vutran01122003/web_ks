const excelService = require("../services/excel.service");

class ExcelController {
    exportUserQualified = async (req, res, next) => {
        try {
            const workbook = await excelService.exportUserQualified();

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=users.xlsx"
            );

            workbook.xlsx
                .write(res)
                .then(() => {
                    if (!res.headersSent) {
                        res.status(200).end();
                    }
                })
                .catch((error) => {
                    console.error("Error writing Excel file:", error);
                    if (!res.headersSent) {
                        res.status(500).json({
                            error: "Internal Server Error",
                        });
                    }
                });
        } catch (error) {
            console.error("Error exporting users:", error);
            if (!res.headersSent) {
                res.status(404).json({ error: "Not Found" });
            }
        }
    };

    importUser = async (req, res, next) => {
        try {
            await excelService.importUser(req);

            res.status(200).json({
                message: "File uploaded and processed successfully.",
            });
        } catch (error) {
            console.error("Error processing uploaded file:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
}

module.exports = new ExcelController();
