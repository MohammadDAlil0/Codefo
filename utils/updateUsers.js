const axios = require('axios');
const {DateTime} = require('luxon');

const User = require('../models/userModel');
const catchAsync = require('./catchAsync');

let i = 0, users;

module.exports = catchAsync(async () => {
    if (i === 0) {
        users = await User.find().select(['handle', 'rating', 'points', 'picture', 'lastUpdatedPoints']);
    }
    if (users.length === 0) {
        return;
    }
    try {
        const codeforcesUser = await axios.get(`https://codeforces.com/api/user.info?handles=${users[i].handle}`);
        if (!codeforcesUser.data || codeforcesUser.data.status !== 'OK')return new Error('error getting codeforcesUser');
        const userLastSubmissions = await axios.get(`https://codeforces.com/api/user.status?handle=${users[i].handle}&from=1&count=50`);
        let curProblem = {}, addPoints = 0, addSolved = 0, mx = 0;
        userLastSubmissions.data.result.forEach(problem => {
            if (problem.creationTimeSeconds > users[i].lastUpdatedPoints) {
                mx = Math.max(problem.creationTimeSeconds, mx);
                if (problem.verdict === 'OK' && !curProblem[`${problem.problem.contestId}${problem.problem.index}`]) {
                    addSolved++;
                    if (!problem.problem.rating) {
                        problem.problem.rating = 0;
                    }
                    addPoints += problem.problem.rating;
                    curProblem[`${problem.problem.contestId}${problem.problem.index}`] = 1;
                }
            }
        });

        if (users[i].solvedProblems === undefined)users[i].solvedProblems = 0;
        users[i].rating = codeforcesUser.data.result[0].rating;
        users[i].picture = codeforcesUser.data.result[0].avatar;
        users[i].points += addPoints;
        users[i].solvedProblems += addSolved;
        users[i].country = codeforcesUser.data.result[0].country;
        users[i].city = codeforcesUser.data.result[0].city;

        const lastUpdatedPointsDate =  DateTime.fromSeconds(users[i].lastUpdatedPoints);
        const now = DateTime.now();
        //last step
        // next step test it and make APIs
        if (now.plus({days: -1}).day === lastUpdatedPointsDate.day) {
            //Update Day Points
            users[i].lastTypePoints[0] = users[i].points;

            //Update Week Points
            if (now.plus({days: -1}).day % 7 === 1) {
                users[i].lastTypePoints[1] = users[i].points;
            }

            //Update Month Points
            if (now.plus({days: -1}).day === 1) {
                users[i].lastTypePoints[2] = users[i].points;
            }

            //Update Year Points
            if (now.plus({days: -1}).day === 1 && now.month === 1) {
                users[i].lastTypePoints[3] = users[i].points;
            }
        }

        users[i].lastUpdatedPoints = mx;
        await users[i].save();
    } catch(err) {
        console.log('Error from here 1', err.message);
    }
    
    i = (i + 1) % users.length;
});