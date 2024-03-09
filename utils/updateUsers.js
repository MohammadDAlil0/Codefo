const axios = require('axios');

const User = require('../models/userModel');
const catchAsync = require('./catchAsync');

let i = 0;

module.exports = catchAsync(async () => {
    const users = await User.find().select(['handle', 'rating', 'points', 'picture', 'lastUpdatedPoints']);
    let arr = '', codeforcesUser;
    users.forEach(user => {
        arr = arr.concat(`${user.handle};`);
    });
    arr = arr.slice(0, -1);
    try {
        console.log(i);
        codeforcesUser = await axios.get(`https://codeforces.com/api/user.info?handles=${arr}`);
        if (!codeforcesUser.data || codeforcesUser.data.status !== 'OK')return;
        
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
        if (!addPoints) {
            console.log(addPoints);
        }
        // add the country and the city
        if (users[i].solvedProblems === undefined)users[i].solvedProblems = 0;
        users[i].rating = codeforcesUser.data.result[i].rating;
        users[i].picture = codeforcesUser.data.result[i].avatar;
        users[i].points += addPoints;
        users[i].solvedProblems += addSolved;
        users[i].lastUpdatedPoints = mx;
        await users[i].save();
    } catch(err) {
        console.log(err.message);
    }
    
    i = (i + 1)% 10;
});