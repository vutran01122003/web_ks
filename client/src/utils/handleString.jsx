export function capitalizeFirstLetter(str) {
    const convertedString = str + '';
    if (!str) return null;
    return convertedString.replace(/^.|\s\S/g, function (match) {
        return match.toUpperCase();
    });
}

export function toFullName({ firstName, lastName }) {
    if (!firstName || !lastName) return 'Chưa Cập Nhật';
    return `${capitalizeFirstLetter(lastName)} ${capitalizeFirstLetter(firstName)}`;
}

export function StandardizePageName(pageName) {
    const parts = pageName.split('|');
    if (parts.length === 1) return pageName;
    parts.splice(-1, 1);
    return parts.join(' ');
}
