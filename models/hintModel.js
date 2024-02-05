const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Types.ObjectId,
        ref: "Problem",
        required: [true, 'A hint must belong to a problem.'],
        immutable: [true, 'You can\'t update problemId']
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'A hint must have a price']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: true
    }
});

module.exports = mongoose.model('Hint', hintSchema);