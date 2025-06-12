export function formatTimeStr(timeStr) {
    if (!timeStr) return '';
    return new Date(timeStr).toLocaleString('en-GB', { hour12: false });
}
