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
    order: Number
});

hintSchema.pre('save', async function(next) {
    const doc = this;
    if (doc.isNew) {
        try {
            const maxOrder = await mongoose.model('Hint').find().sort({ order: -1 }).limit(1);
            doc.order = maxOrder.length > 0 ? maxOrder[0].order + 1 : 1;
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
    next();
});



module.exports = mongoose.model('Hint', hintSchema);