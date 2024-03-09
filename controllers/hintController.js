
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
    const docs = await Hint.find({problemId: req.body.problemId});
    const problem = await Problem.findById(docs[0].problemId);
    if (!docs.length || problem.userId.toString() !== req.user.id) {
        return next(new AppError('No problem match with this user!', 404));
    }
    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: docs
    });
});

exports.buyHint = catchAsync(async (req, res, next) => {
    const hintId = req.params.hintId;
    const mementoId = req.body.mementoId;
    const hint = await Hint.findById(hintId);
    const newMemento = await Memento.findByIdAndUpdate(mementoId, {
        $push: {hints: hintId},
        $inc: {totalPaid: hint.price}
    }, {
        new: true
    });
    if (!newMemento) {
        return next(new AppError('There is no memento for that ID', 400));
    }
    await User.findByIdAndUpdate(req.user.id, {
        $inc: {spentPoints: hint.price}
    });
    res.status(200).json({
        status: 'success',
        data: newMemento
    });
});