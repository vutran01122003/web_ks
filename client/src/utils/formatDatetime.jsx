import moment from 'moment';

export function formatTimeStr(timeStr) {
    return new Date(timeStr).toLocaleDateString('en-GB');
}

export const getLocalDatetime = (datetime) => {
    const pattern = 'DD/MM/YYYY HH:mm';
    const formattedDatetimeStr = moment(datetime).format(pattern);
    const part = formattedDatetimeStr.split(' ');

    return `${part[0]} lúc ${part[1]}`;
};

export default formatTimeStr;
