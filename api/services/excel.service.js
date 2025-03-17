const ExcelJS = require("exceljs/dist/es5");
const { userColumn, addUserData, progressStatisticsColumn } = require("../config/exceljs.config");
const AccessService = require("../services/access.service");
const createHttpError = require("http-errors");
const { capitalizeFirstLetter } = require("../utils/handleString");
const mongoose = require("mongoose");
const conn = require("../dbs/init.mongodb");

const { TALENT_ENGINEER_CODE } = process.env;

class ExcelService {
    static exportQualifiedUsersExcel = async (qualifiedUsersData) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("My Sheet");

            sheet.columns = userColumn;

            qualifiedUsersData.forEach((user, index) => {
                const { firstName, lastName, faculty, major } = user;
                const data = {
                    s_no: index + 1,
                    ...user,
                    firstName: capitalizeFirstLetter(firstName),
                    lastName: capitalizeFirstLetter(lastName),
                    faculty: capitalizeFirstLetter(faculty),
                    major: capitalizeFirstLetter(major)
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
        const session = await conn.startSession();
        const transaction = { session };
        let prevRegisterUserList = [];

        try {
            session.startTransaction();

            const workbook = new ExcelJS.Workbook();
            const buffer = req.file.buffer;

            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);

            let headerColumns = [];
            worksheet.getRow(1).eachCell((cell) => {
                const value = cell.text.toLowerCase();
                if (value) headerColumns.push(value);
            });

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const data = {};

                    data.password = "1111";
                    row.eachCell((cell, colNumber) => {
                        // In ExcelJS, Column index start from 1.
                        // The first column is STT which is ignored
                        if (colNumber > 1) {
                            // headerColumns must subtract 1 index because the first index is zero.
                            addUserData(cell, headerColumns[colNumber - 1], data);
                        }
                    });

                    prevRegisterUserList.push(data);
                }
            });

            const results = await Promise.allSettled(
                prevRegisterUserList.map((prevRegisterUser) =>
                    AccessService.register({
                        data: prevRegisterUser,
                        groupCode: TALENT_ENGINEER_CODE,
                        transaction: transaction
                    })
                )
            );

            for (let i = 0; i < results.length; i++) {
                if (results[i].status === "rejected") throw createHttpError.BadRequest(results[i].reason.message);
            }

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }
    };
}

module.exports = ExcelService;
