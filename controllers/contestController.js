const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErorr');
const APIFeatures = require('../utils/apiFeatures');

exports.topUser = catchAsync(async (req, res, next) => {
    const contestNumber = req.params.contestNumber;
    let users = await User.find().select(['handle', 'name', 'points', 'lastTypePoints']);
    
    users.sort(function(a, b) {
        return (b.points - b.lastTypePoints[contestNumber]) - (a.points - a.lastTypePoints[contestNumber]);
    });

    users = users.slice(0, 10);

    res.status(200).json({
        status: 'success',
        result: users.length,
        data: users
    });
});



