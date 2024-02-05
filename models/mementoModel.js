const mongoose = require('mongoose');

const mementoSchema = new mongoose.Schema({
    problemId: {
        type: mongoose.Types.ObjectId,
        ref: "Problem",
        required: [true, 'A memento must have a problem ID']
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'A memento must have a user ID']
    },
    totalPaid: {
        type: Number,
        default: 0
    },
    hints: [{
        type: mongoose.Types.ObjectId,
        ref: "Hint"
    }]
});

module.exports = mongoose.model('Memento', mementoSchema);