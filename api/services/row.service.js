const Page = require('../models/page.model');
const Row = require('../models/row.model');

class RowService {
    static addRow = async ({ data }) => {
        try {
            const { user, table, page, content } = data;
            let rowList = await Row.findOne({ user, table, page });
            let rowItemId = null;

            if (!rowList) {
                rowList = await Row({
                    user,
                    table,
                    page
                });

                rowList.content.push({
                    rowValue: content
                });

                rowItemId = rowList.content[rowList.content.length - 1]._id;

                await rowList.save();

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

                rowItemId = rowList.content[rowList.content.length - 1]._id;
            }
            return {
                rowList,
                rowItemId
            };
        } catch (error) {
            throw error;
        }
    };

    static addProofImages = async ({ uploadedImages, rowListId, rowItemId, data }) => {
        try {
            await Row.findOneAndUpdate(
                { _id: rowListId, 'content._id': rowItemId },
                {
                    $set: {
                        'content.$.proofImageList': uploadedImages.results
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    };
}

module.exports = RowService;
