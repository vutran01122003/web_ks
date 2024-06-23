export function formatTimeStr(timeStr) {
    return new Date(timeStr)
        .toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
        .toLocaleUpperCase();
}
