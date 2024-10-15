function validateResource(schema) {
    return function (req, res, next) {
        try {
            const payload = {
                body: req.body,
                params: req.params,
                query: req.query,
            };

            if (Object.keys(req.body).length === 0) delete payload.body;
            if (Object.keys(req.params).length === 0) delete payload.params;
            if (Object.keys(req.query).length === 0) delete payload.query;

            const { error } = schema.validate(payload);

            if (error) throw error;

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = validateResource;
