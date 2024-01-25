const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Types.ObjectId,
        ref: "Problem",
        required: [true, 'A hint must belong to a problem.']
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'A hint must have a price']
    }
});

module.exports = mongoose.model('Hint', hintSchema);