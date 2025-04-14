const ExcelJS = require("exceljs/dist/es5");
const { userColumn, addUserData, progressStatisticsColumn } = require("../config/exceljs.config");
const AccessService = require("../services/access.service");
const createHttpError = require("http-errors");
const { capitalizeFirstLetter } = require("../utils/handleString");
const conn = require("../dbs/init.mongodb");
const User = require("../models/user.model");

const { TALENT_ENGINEER_CODE } = process.env;

class ExcelService {
    static exportQualifiedUsersExcel = async (qualifiedUsersData) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("My Sheet");

            sheet.columns = userColumn;

            qualifiedUsersData.forEach((user, index) => {
                console.log(user);
                const { firstName, lastName, faculty, major, cohort, userId, birthday, email, phone, gender } = user;
                const data = {
                    s_no: index + 1,
                    userId,
                    birthday,
                    email,
                    phone,
                    gender,
                    firstName: capitalizeFirstLetter(firstName),
                    lastName: capitalizeFirstLetter(lastName),
                    faculty: capitalizeFirstLetter(faculty.facultyName),
                    major: capitalizeFirstLetter(major.majorName),
                    cohort: cohort.cohortName
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
                const { progressData, firstName, lastName, faculty, major, cohort } = progressItem;

                const data = {
                    s_no: index + 1,
                    ...progressItem,
                    firstName: capitalizeFirstLetter(firstName),
                    lastName: capitalizeFirstLetter(lastName),
                    faculty: capitalizeFirstLetter(faculty.facultyName),
                    major: capitalizeFirstLetter(major.majorName),
                    cohort: cohort.cohortName,
                    progressPercentage: progressData?.progressPercentage || 0,
                    totalScore: progressData?.totalScore || 0
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
        const password = process.env.DEFAULT_PASSWORD;
        const prevRegisterUserList = [];
        const userIdList = [];

        try {
            const workbook = new ExcelJS.Workbook();
            const buffer = req.file.buffer;

            await workbook.xlsx.load(buffer);

            const worksheet = workbook.getWorksheet(1);

            const headerColumns = [];
            worksheet.getRow(1).eachCell((cell) => {
                const value = cell.text.toLowerCase();
                if (value) headerColumns.push(value);
            });

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    const data = {};

                    data.password = password;
                    row.eachCell((cell, colNumber) => {
                        // In ExcelJS, Column index start from 1. The first column is STT which is ignored.
                        if (colNumber > 1) {
                            // headerColumns must subtract 1 index because the first index is zero.
                            addUserData(cell, headerColumns[colNumber - 1], data);
                        }
                    });

                    const userId = data.userId;
                    if (userIdList.includes(userId))
                        throw createHttpError.BadRequest(`Mã số ${userId} đã bị trùng lặp.`);
                    userIdList.push(userId);
                    prevRegisterUserList.push(data);
                }
            });

            const user = await User.findOne({ userId: { $in: userIdList } });
            if (user) throw createHttpError.BadRequest(`Đã có sinh viên ${user.userId} tồn tại trong hệ thống.`);

            await Promise.allSettled(
                prevRegisterUserList.map((prevRegisterUser) =>
                    AccessService.register({
                        data: prevRegisterUser,
                        groupCode: TALENT_ENGINEER_CODE,
                        isExcelImport: true
                    })
                )
            );
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ExcelService;
