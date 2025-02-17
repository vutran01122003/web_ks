const userColumn = [
    { header: "STT", key: "s_no", width: 10 },
    { header: "MSSV", key: "userId", width: 10 },
    { header: "Họ đệm", key: "lastName", width: 20 },
    { header: "Tên", key: "firstName", width: 10 },
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
    { header: "Ngày sinh", key: "birthday", width: 15 },
    { header: "Khoa", key: "faculty", width: 25 },
    { header: "Chuyên ngành", key: "major", width: 25 },
    { header: "Khoá", key: "cohort", width: 10 },
    { header: "Tổng tiến độ (%)", key: "progressPercentage", width: 20 },
    { header: "Tổng điểm", key: "totalScore", width: 15 }
];

const addUserData = (cell, colNumber, data) => {
    switch (colNumber) {
        case 2:
            data.userId = cell.value;
            break;
        case 3:
            data.lastName = cell.value;
            break;
        case 4:
            data.firstName = cell.value;
            break;
        case 5:
            data.birthday = cell.value;
            break;
        case 6:
            data.faculty = cell.value;
            break;
        case 7:
            data.major = cell.value;
            break;
        case 8:
            data.cohort = cell.value;
            break;
        case 9:
            data.email = cell.value.text || cell.value;
            break;
        case 10:
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
