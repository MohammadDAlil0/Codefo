const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appErorr');
const axios = require('axios');

const signToken = id => jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE_IN});

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const codeforcesUser = await axios.get(`https://codeforces.com/api/user.info?handles=${req.body.handle}`);
    if (codeforcesUser.data.status !== 'OK') {
        return next(new AppError('Please provide a valid Codeforces\' handle', 403));
    }
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {handle, password} = req.body;
    if (!handle || !password) {
        return next(new AppError('Please provide handle and password', 400));
    }
    const curUser = await User.findOne({handle: handle}).select('+password');
    
    if (!curUser || !await bcrypt.compare(password, curUser.password)) {
        return next(new AppError('Incorrect handle or password!', 404));
    }
    createSendToken(curUser, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const curUser = await User.findById(decoded.id);
    if (!curUser) {
        return next(new AppError('The user belonging to this token does no longer exist!', 401));
    }
    req.user = curUser;

    next();
});