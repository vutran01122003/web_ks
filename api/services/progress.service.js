const mongoose = require('mongoose');
const Page = require('../models/page.model');

class ProgressService {
    static getProgressByYear = async ({
        pageStudentMajor,
        pageStudentLevelYear,
        pageStudentCohort,
        userId
    }) => {
        try {
            const pageDetailsList = await Page.aggregate([
                {
                    $match: {
                        pageStudentMajor,
                        pageStudentLevelYear: pageStudentLevelYear * 1,
                        pageStudentCohort: pageStudentCohort * 1
                    }
                },
                {
                    $unwind: '$tables'
                },
                {
                    $lookup: {
                        from: 'rows',
                        let: { rowIds: '$tables.rowValueList' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ['$_id', '$$rowIds'] },
                                            { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'tables.rowValueList'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        pageName: { $first: '$pageName' },
                        pageType: { $first: '$pageType' },
                        pageFaculty: { $first: '$pageFaculty' },
                        pageStudentMajor: { $first: '$pageStudentMajor' },
                        pageStudentCohort: { $first: '$pageStudentCohort' },
                        pageStudentLevelYear: { $first: '$pageStudentLevelYear' },
                        tables: {
                            $push: '$tables'
                        }
                    }
                },
                {
                    $sort: {
                        pageName: 1
                    }
                }
            ]);

            return pageDetailsList;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = ProgressService;
