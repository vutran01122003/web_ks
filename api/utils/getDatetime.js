module.exports = {
    getLocalDatetime: () => {
        const currentDateVN = new Date();
        currentDateVN.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        return new Date(currentDateVN.setHours(currentDateVN.getHours()));
    },
    toISOString: (datetimeStr) => {
        if (!datetimeStr) return null;
        return new Date(`${datetimeStr}:00.000Z`);
    }
};
