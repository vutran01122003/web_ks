export function formatTimeStr(timeStr) {
    return new Date(timeStr).toLocaleString('en-GB', { hour12: false });
}
