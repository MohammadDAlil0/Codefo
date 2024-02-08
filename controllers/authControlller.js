const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appErorr');
const sendEmail = require('../utils//email');

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
    const { handle, password, passwordConfirm, name, email } = req.body;
    if (codeforcesUser.data.status !== 'OK') {
        return next(new AppError('Please provide a valid Codeforces\' handle', 403));
    }
    const newUser = await User.create({ handle, password, passwordConfirm, name, email });
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

exports.isLoggedIn = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next();
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const curUser = await User.findById(decoded.id);
    if (!curUser) {
        return next();
    }
    req.user = curUser;

    next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if (!user) {
        return next(new AppError('there is no user with this email address', 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a patch request with a newPassword and confirm password 
    to: ${resetURL}.\nIf your didn't forgot your password. Please ignore thie email`;
    console.log(user);
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token is valid for 10 min',
            message: message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to the email'
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false} );
        next(new AppError('There was an error sending the email. Try again later!'), 500);
    }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    createSendToken(user, 201, res);
});
