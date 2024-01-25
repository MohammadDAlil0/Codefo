
const Problem = require('../models/problemModel');
const Hint = require('../models/hintModel');

const User = require('../models/userModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErorr');

exports.createHint = factory.createOne(Hint);
exports.getHintsProblem = catchAsync(async (req, res, next) => {
    // problem must be either my problem or it is not belong to visivible folder
    let problem = Problem.findOne({
        $or: [
            {_id: req.body.problemId, userId: req.user.id},
            {_id: req.body.problemId, folderVisibilty: true}
        ]
    });
    if (!problem) {
        return next(AppError('You can\'t get Hints of this problem', 403));
    }
    const docs = Hint.find({problemId: req.body.problemId});

    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: docs
    });
});

exports.getProblem = factory.getOne(Problem);
exports.updateProblem = factory.updateOne(Problem); 
exports.deleteProblem = factory.deleteOne(Problem);
