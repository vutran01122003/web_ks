const userColumn = [
    { header: "STT", key: "s_no", width: 10 },
    { header: "MSSV", key: "userId", width: 10 },
    { header: "Họ đệm", key: "lastName", width: 20 },
    { header: "Tên", key: "firstName", width: 10 },
    { header: "Giới tính", key: "gender", width: 15 },
    { header: "Ngày sinh", key: "birthday", width: 15 },
    { header: "Khoa", key: "faculty", width: 25 },
    { header: "Chuyên ngành", key: "major", width: 25 },
    { header: "Khoá", key: "cohort", width: 10 },
    { header: "Email", key: "email", width: 30 },
    { header: "Điện thoại", key: "phone", width: 15 }
];

const progressStatisticsColumn = [
    { header: "STT", key: "s_no", width: 10 },
    { header: "MSSV", key: "userId", width: 10 },
    { header: "Họ đệm", key: "lastName", width: 20 },
    { header: "Tên", key: "firstName", width: 10 },
    { header: "Giới tính", key: "gender", width: 15 },
    { header: "Ngày sinh", key: "birthday", width: 15 },
    { header: "Khoa", key: "faculty", width: 25 },
    { header: "Chuyên ngành", key: "major", width: 25 },
    { header: "Khoá", key: "cohort", width: 10 },
    { header: "Tổng tiến độ (%)", key: "progressPercentage", width: 20 },
    { header: "Tổng điểm", key: "totalScore", width: 15 }
];

const addUserData = (cell, colName, data) => {
    switch (colName) {
        case "mssv":
            data.userId = cell.value;
            break;
        case "họ đệm":
            data.lastName = cell.value;
            break;
        case "tên":
            data.firstName = cell.value;
            break;
        case "giới tính":
            data.gender = cell.value;
            break;
        case "ngày sinh":
            data.birthday = cell.value;
            break;
        case "khoa":
            data.faculty = cell.value;
            break;
        case "chuyên ngành":
            data.major = cell.value;
            break;
        case "khóa":
            data.cohort = cell.value;
            break;
        case "email":
            data.email = cell.value.text || cell.value;
            break;
        case "điện thoại":
            data.phone = cell.value;
            break;
        default:
            break;
    }
};

module.exports = {
    userColumn,
    progressStatisticsColumn,
    addUserData
};
