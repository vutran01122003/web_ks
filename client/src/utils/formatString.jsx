export function capitalizeFirstLetter(str) {
    const convertedString = str + '';
    if (!str) return null;
    return convertedString.replace(/^.|\s\S/g, function (match) {
        return match.toUpperCase();
    });
}
