export function capitalizeFirstLetter(str) {
    if (!str) return null;
    return str.replace(/^.|\s\S/g, function (match) {
        return match.toUpperCase();
    });
}
