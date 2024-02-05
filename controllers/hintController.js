
const Problem = require('../models/problemModel');
const Hint = require('../models/hintModel');
const Memento = require('../models/mementoModel');

const User = require('../models/userModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErorr');

exports.createHint = factory.createOne(Hint);
exports.updateHint = factory.updateOne(Hint); 
exports.deleteHint = factory.deleteOne(Hint);

exports.getMyHints = catchAsync(async (req, res, next) => {
    let problem = Problem.findOne({_id: req.body.problemId, userId: req.user.id});
    if (!problem) {
        return next(AppError('No problem match with this user!', 404));
    }
    const docs = await Hint.find({problemId: req.body.problemId});

    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: docs
    });
});

exports.getAvailableHints = catchAsync(async (req, res, next) => {
    const problemId = req.params.problemId;
    const userId = req.body.id;
    
});

exports.buyHint = catchAsync(async (req, res, next) => {
    const hintId = req.params.hintId;
    const mementoId = req.body.mementoId;
    const hint = await Hint.findById(hintId);
    console.log(hint);
    await User.findByIdAndUpdate(req.body.id, {
        $inc: {spentPoints: hint.price}
    });
    const newMemento = await Memento.findByIdAndUpdate(mementoId, {
        $push: {hints: hintId}
    }, {
        new: true
    });
    res.status(200).json({
        status: 'success',
        data: newMemento
    });
});