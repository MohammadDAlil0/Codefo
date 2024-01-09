const factory = require('./handleFactory');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErorr');

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.addFolder = catchAsync(async (req, res, next) => {
    const doc = {
        name: req.body.name,
        visibilty: req.body.visibilty
    };
    if (!doc.name) {
        return next(new AppError('A folder must have a name'), 400);
    }
    const isExist = req.user.folders.some(el => el.name === doc.name);
    if(isExist) {
        return next(new AppError('this folder is already exist', 400));
    }
    const newUser = await User.findByIdAndUpdate(req.user.id, {$push: {folders: doc}}, {
        new: true,
        runValidators: false
    });    

    res.status(200).json({
        status: 'success',
        data: newUser.folders
    });
});

exports.editFolder = catchAsync(async (req, res, next) => {
    const folderId = req.params.folderId;
    const {name, visibilty} = req.body;
    if (!name) {
        return next(new AppError('A folder must have a name'), 400);
    }
    const newUser = await User.findOneAndUpdate({_id: req.user.id, 'folders._id': folderId}, {
        $set: {'folders.$': {name, visibilty}}
    }, {
        new: true,
        runValidators: false
    });

    if(!newUser) {
        return next(new AppError('there is no such folder belongs to the user!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: newUser.folders
    });
});

exports.addFriend = catchAsync(async (req, res, next) => {
    if (req.user.friends.includes(req.params.friendId)) {
        return next(new AppError('You have this friend already!', 400));
    }
    const friend = await User.findByIdAndUpdate(req.params.friendId, {
        $inc: {followers: 1}
    }, {
        new: true,
        runValidators: false
    });
    if(!friend) {
        return next(new AppError('there is no user with that ID', 400));
    }
    await User.findByIdAndUpdate(req.user.id, {
        $push: {friends: req.params.friendId}
    });
    res.status(200).json({
        status: 'success',
        data: null
    });
});

exports.deleteFriend = catchAsync(async (req, res, next) => {
    if (!req.user.friends.includes(req.params.friendId)) {
        return next(new AppError('That\'s not your friend :(', 400));
    }
    const friend = await User.findByIdAndUpdate(req.params.friendId, {
        $inc: {followers: -1}
    }, {
        new: true,
        runValidators: false
    });
    if(!friend) {
        return next(new AppError('there is no user with that ID', 400));
    }
    await User.findByIdAndUpdate(req.user.id, {
        $pull: {friends: req.params.friendId}
    });
    res.status(204).json({
        status: 'success',
        data: null
    });
});