const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    handle: {
        type: String,
        unique: true,
        required: [true, 'A user must has a Codeforces\' handle!']
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [8, 'A password must be more than 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: "passwords are not the same!"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    name: {
        type: String,
        required: [true, 'A user must has a name!'],
        lowercase: true
    },
    picture: String,
    rate: Number,
    points: Number,
    spentPoints: {
        type: Number,
        default: 0
    },
    brief: String,
    followers: {
        type: Number,
        default: 0
    },
    solvedProblems: Number,
    email: {
        type: String,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    socialMediaAccounts: [{
        site: {
            type: String,
            enum: ['facebook', 'linkedin', 'youtube', 'atcoder', 'hackerrank', 'leetcode', 'codechef']
        },
        email: {
            type: String,
            lowercase: true
        }
    }],
    folders: [{
        name: {
            type: String
        },
        visibilty: {
            type: Boolean
        }
    }],
    friends: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}});
    next();
});

/*
userSchema.post('find', function(docs, next) {
    if (Array.isArray(docs)) {
        docs.forEach(user => {
            if (user.folders.length) {
                user.folders = user.folders.filter(el => el.visibilty);
            }
        });
    }
    next();
});
*/


module.exports = mongoose.model('User', userSchema);