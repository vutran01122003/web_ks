const ExcelJS = require("exceljs/dist/es5");
const { userColumn, addUserData, progressStatisticsColumn } = require("../config/exceljs.config");
const AccessService = require("../services/access.service");
const createHttpError = require("http-errors");

const { TALENT_ENGINEER_CODE } = process.env;

class ExcelService {
    static exportQualifiedUsersExcel = async (qualifiedUsersData) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("My Sheet");

            sheet.columns = userColumn;

            qualifiedUsersData.forEach((user, index) => {
                const data = {
                    s_no: index + 1,
                    ...user
                };

                sheet.addRow(data);
            });

            sheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });

            return workbook;
        } catch (error) {
            throw createHttpError.BadRequest("Lỗi xuất dữ liệu excel");
        }
    };

    static exportProgressStatisticsExcel = async (progressStatisticsData) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("My Sheet");

            sheet.columns = progressStatisticsColumn;

            progressStatisticsData.forEach((progressItem, index) => {
                const data = {
                    s_no: index + 1,
                    ...progressItem,
                    progressPercentage: progressItem.progressData?.progressPercentage || 0,
                    totalScore: progressItem.progressData?.totalScore || 0
                };

                sheet.addRow(data);
            });

            sheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });

            return workbook;
        } catch (error) {
            throw createHttpError.BadRequest("Lỗi xuất dữ liệu excel");
        }
    };

    static importUser = async (req) => {
        try {
            let prevRegisterUserList = [];
            const workbook = new ExcelJS.Workbook();
            const buffer = req.file.buffer;

            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const data = {};
                    data.password = "1111";
                    row.eachCell((cell, colNumber) => {
                        if (colNumber > 1) {
                            addUserData(cell, colNumber, data);
                        }
                    });
                    prevRegisterUserList.push(data);
                }
            });

            await Promise.all(
                prevRegisterUserList.map((prevRegisterUser) =>
                    AccessService.register({
                        data: prevRegisterUser,
                        groupCode: TALENT_ENGINEER_CODE
                    })
                )
            );
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ExcelService;
