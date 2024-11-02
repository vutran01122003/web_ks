class Pagination {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating = async () => {
        if (!this.queryString?.limit) return this.query;
        const page = this.queryString?.page * 1;
        const limit = this.queryString?.limit * 1;
        const numOfDocs = this.queryString?.numOfDocs;

        // The recipe: (page - 1) * limit not true when we delete or create element in current page
        // numOfDocs help system to exactly paganate page if this occur
        // skip is negative if we create new element in current page

        const skip = Math.abs((page - 1) * limit + (numOfDocs ? (page - 1) * limit - numOfDocs : 0));

        return this.query.skip(skip).limit(limit);
    };
}

module.exports = Pagination;
