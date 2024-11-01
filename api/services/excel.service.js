const ExcelJS = require("exceljs/dist/es5");
const { userColumn, addDataOfRow } = require("../config/exceljs.config");
const AccessService = require("../services/access.service");
const User = require("../models/user.model");
const createHttpError = require("http-errors");

const { TALENT_ENGINEER_CODE } = process.env;

class ExcelService {
    static exportUserQualified = async () => {
        try {
            const workbook = new ExcelJS.Workbook();

            const sheet = workbook.addWorksheet("My Sheet");

            sheet.columns = userColumn;

            let counter = 1;

            const userData = await User.find();

            userData.forEach((user) => {
                user.s_no = counter;

                sheet.addRow(user);
                counter++;
            });

            sheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });

            return workbook;
        } catch (error) {
            throw createHttpError.BadRequest("Lỗi xuất dữ liệu exel");
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
                            addDataOfRow(cell, colNumber, data);
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
            throw createHttpError.BadRequest("Lỗi nhập dữ liệu exel");
        }
    };
}

module.exports = ExcelService;
