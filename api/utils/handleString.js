module.exports = {
    concatFirstNameAndLastName: ({ firstName, lastName }) => {
        return `${this.capitalizeFirstLetter(lastName)} ${this.capitalizeFirstLetter(firstName)}`;
    },

    capitalizeFirstLetter: (string) => {
        return string
            .trim()
            .split(' ')
            .map((string) => {
                let parts = string.split('');
                parts[0] = parts[0].toUpperCase();
                return parts.join('');
            })
            .join(' ');
    }
};
