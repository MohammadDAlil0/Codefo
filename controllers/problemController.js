const axios = require('axios');

const factory = require('./handleFactory');
const Problem = require('../models/problemModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErorr');

exports.createProblem = factory.createOne(Problem)
exports.getProblem = factory.getOne(Problem);
exports.getAllProblems = factory.getAll(Problem);
exports.updateProblem = factory.updateOne(Problem); 
exports.deleteProblem = factory.deleteOne(Problem);

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
    
    req.body.name = req.body.name || curProblem.name;
    req.body.tags = req.body.tags || curProblem.tags;
    req.body.rating = curProblem.rating;
    req.body.userId = req.user.id;
    req.body.userName = req.user.name;
    req.body.votes = req.body.hints = undefined;
    
    next();

});
