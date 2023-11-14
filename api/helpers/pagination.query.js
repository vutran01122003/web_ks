class QueryFeaturesAPI {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating = async () => {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = (page - 1) * limit;
        this.query = this.query.limit(limit).skip(skip);

        return this;
    };
}

module.exports = QueryFeaturesAPI;
