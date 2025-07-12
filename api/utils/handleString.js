module.exports = {
    capitalizeFirstLetter: function (string) {
        if (!string) return "";

        return string
            .trim()
            .split(" ")
            .map((string) => {
                let parts = string.split("");
                parts[0] = parts[0].toUpperCase();
                return parts.join("");
            })
            .join(" ");
    }
};
