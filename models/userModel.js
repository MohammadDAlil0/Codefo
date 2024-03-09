const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userShcema = new mongoose.Schema({
    handle: {
        type: String,
        unique: true,
        required: [true, 'A user must have a Codeforces\' handle!']
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
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },  
    name: {
        type: String,
        required: [true, 'A user must have a name!']
    },
    picture: String,
    rating: Number,
    points: Number,
    lastUpdatedPoints: {
        type: Number,
        default: 0,
        select: false
    },
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
        required: [true, 'A user must have an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true
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
    country: String,
    city: String
});

userShcema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userShcema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 1000 * 60 * 10;

    return resetToken;
};

userShcema.post(/^find/, function(doc, next) {
    if (Array.isArray(doc)) {
        doc.forEach(el => {
            el.points -= el.spentPoints;
        })
    }
    else {
        doc.points -= doc.spentPoints;
    }
    next();
});


module.exports = mongoose.model('User', userShcema);