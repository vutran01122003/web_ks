const ExcelJS = require('exceljs/dist/es5');
const User = require('../models/user.model');
const { userColumn, addDataOfRow } = require('../config/exceljs.config');
const accessService = require('../services/access.service');

class ExcelService {
    static exportUserQualified = async () => {
        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet('My Sheet');

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
    };

    static importUser = async (req) => {
        const workbook = new ExcelJS.Workbook();
        const buffer = req.file.buffer;

        await workbook.xlsx.load(buffer);

        const worksheet = workbook.getWorksheet(1);

        // const registerData = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const data = {};
                data.password = '1111';
                row.eachCell((cell, colNumber) => {
                    if (colNumber > 1) {
                        addDataOfRow(cell, colNumber, data);
                    }
                });
                accessService.register(data);
                // registerData.push(data);
            }
        });
    };
}

module.exports = ExcelService;
