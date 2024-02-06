const axios = require('axios');

const Problem = require('../models/problemModel');
const Memento = require('../models/mementoModel');
const User = require('../models/userModel');
const Hint = require('../models/hintModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErorr');

exports.createProblem = factory.createOne(Problem)
exports.getProblem = factory.getOne(Problem);
//exports.getAllProblems = factory.getAll(Problem);
exports.updateProblem = factory.updateOne(Problem); 
exports.deleteProblem = factory.deleteOne(Problem);
exports.saveMemento = factory.createOne(Memento);

exports.getUserProblems = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    const folderName = req.body.folderName;
    
    const docs = await Problem.findOne({userId: userId, folderName: folderName, folderVisibilty: true});
    if (!docs) {
        return next(new AppError('UserId or folderName seem to be not correct', 400));
    }

    res.status(200).json({
        status: 'success',
        data: docs
    });
});

exports.getMyProblems = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const folderName = req.body.folderName;

    const query = Problem.find({userId: userId});
    if (folderName) {
        query.find({folderName: folderName});
    }
    const docs = await query;

    res.status(200).json({
        status: 'success',
        result: docs.length,
        data: docs
    });
});


exports.editProblemInput = catchAsync(async (req, res, next) => {
    const contestId = req.body.contestId;
    const problemNumber = req.body.problemId;

    let result = await axios.get(`https://codeforces.com/api/contest.status?contestId=${contestId}&handle=${req.user.handle}&&from=1&count=100`);

    let curProblem;
    //Search inside my submissions
    result.data.result.forEach(el => {
        if (el.problem.index === problemNumber) {
            if(!req.body.verdict) {
                req.body.verdict = el.verdict;
            }
            else if (el.verdict === 'OK')
                req.body.verdict = el.verdict;
            curProblem = el.problem;
        }
    });
    if (!curProblem) { //It's not in my submissions then search for the problem
        result = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=0&showUnofficial=true`);

        curProblem = result.data.result.problems.find(el => el.index === problemNumber);
        if (!curProblem) {
            return next(new AppError('There is no such problem', 400));
        }
        req.body.verdict = 'Unsolved';
    }

    const userFolder = req.user.folders.find(el => el.name === req.body.folderName);

    if (!userFolder) {
        return next(new AppError('There is no such folder belongs to the user', 400));
    }

    req.body.folderVisibilty = userFolder.visibilty;
    req.body.name = req.body.name || curProblem.name;
    req.body.tags = req.body.tags || curProblem.tags;
    req.body.rating = curProblem.rating;
    req.body.userId = req.user.id;
    req.body.userName = req.user.name;
    req.body.votes = req.body.hints = undefined;
    
    next();

});

exports.editProblemUpdate = catchAsync(async (req, res, next) => {
    req.body = {
        name: req.body.name,
        brief: req.body.brief,
        tags: req.body.tags
    };
    next();
});

exports.getMyMementos = catchAsync(async (req, res, next) => {
    const mementos = await Memento.find({userId: req.user.id}).populate('hints');
    await Promise.all(
        mementos.map(async memento => {
            let lastHint, mx;
            if(memento.hints.length) {
                mx = Math.max(...memento.hints.map(el => el.createdAt));
            }
            if (!mx) mx = 0;
            lastHint = await Hint.findOne({problemId: memento.problemId, createdAt: {$gt: mx}});
            if(lastHint)memento.hints.push(lastHint._id);
        })
    );

    res.status(200).json({
        status: "success",
        result: mementos.length,
        data: mementos
    });
});

exports.getProblemSet = catchAsync(async (req, res, next) => {

});

exports.voteForProblem = catchAsync(async (req, res, next) => {
    const problemId = req.body.problemId;
    const state = req.body.state;

    await Problem.findOneAndUpdate({_id: problemId}, {
        $pull: {votes: {'_id': req.user.id}}
    });
    const newProblem = await Problem.findByIdAndUpdate(problemId, {
        $push: {votes: {
            _id: req.user.id,
            state
        }}
    }, {
        runValidators: true,
        new: true
    });

    newProblem.updateTotalVotes();

    res.status(200).json({
        status: "success",
        data: newProblem
    });
});