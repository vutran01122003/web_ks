class Pagination {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating = async () => {
        const page = this.queryString.page * 1;
        const limit = this.queryString.limit * 1;
        const currentNumNotifications = this.queryString.currentNumNotifications;

        const skip = (page - 1) * limit + ((page - 1) * limit - currentNumNotifications);
        return await this.query.limit(limit).skip(skip);
    };
}

module.exports = Pagination;
