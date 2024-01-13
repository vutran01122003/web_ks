const userColumn = [
    { header: "STT", key: "s_no", width: 5 },
    { header: "MSSV", key: "studentId", width: 10 },
    { header: "Họ và tên", key: "fullName", width: 25 },
    { header: "Ngày sinh", key: "birthday", width: 12 },
    { header: "Khoa", key: "faculty", width: 30 },
    { header: "Chuyên ngành", key: "major", width: 30 },
    { header: "Khoá", key: "cohort", width: 5 },
    { header: "Email", key: "email", width: 35 },
    { header: "Điện thoại", key: "phone", width: 15 },
];

const addDataOfRow = (cell, colNumber, data) => {
    switch (colNumber) {
        case 2:
            data.studentId = cell.value;
            break;
        case 3:
            data.fullName = cell.value;
            break;
        case 4:
            data.birthday = cell.value;
            break;
        case 5:
            data.faculty = cell.value;
            break;
        case 6:
            data.major = cell.value;
            break;
        case 7:
            data.cohort = cell.value;
            break;
        case 8:
            data.email = cell.value;
            break;
        case 9:
            data.phone = cell.value;
            break;
        default:
            break;
    }
};

module.exports = {
    userColumn,
    addDataOfRow,
};
