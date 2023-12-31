export function formatTimeStr(timeStr) {
    return new Date(timeStr).toLocaleDateString('en-GB');
}

export default formatTimeStr;