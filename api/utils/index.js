const slugify = require("slugify");

function slugifyWithSlashes(myString) {
    return myString
        .split("/")
        .map((val) => slugify(val, "_"))
        .join("/");
}

module.exports = {
    slugifyWithSlashes
};
