const Page = require('../models/page.model');
const Row = require('../models/row.model');

class rowService {
    static addRow = async (data) => {
        try {
            const { user, table, page, content } = data;
            let rowList = await Row.findOne({ user, table, page });
            if (!rowList) {
                rowList = await Row.create({
                    user,
                    table,
                    page,
                    content: [
                        {
                            rowValue: content
                        }
                    ]
                });

                // await Row.findByIdAndUpdate(rowList._id, { $push: { content: content } });

                await Page.findOneAndUpdate(
                    { _id: page, 'tables._id': table },
                    {
                        $push: {
                            'tables.$.rowValueList': rowList._id
                        }
                    }
                );
            } else {
                rowList = await Row.findOneAndUpdate(
                    {
                        user,
                        table,
                        page
                    },
                    {
                        $push: {
                            content: {
                                rowValue: content
                            }
                        }
                    },
                    { new: true }
                ).lean();
            }
            return rowList;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
}

module.exports = rowService;
