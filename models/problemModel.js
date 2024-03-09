const mongoose = require('mongoose');
const Memento = require('./mementoModel');
const Hint = require('./hintModel');

const problemTags = ['implementation', 'math', 'greedy', 'dp', 'data structures', 'brute force', 'constructive algorithms', 'graphs', 'sortings', 'binary search', 'dfs and similar', 'trees', 'strings', 'number theory', 'combinatorics', 'special', 'geometry', 'bitmasks', 'two pointers', 'dsu', 'shortest paths', 'probabilities', 'divide and conquer', 'hashing games', 'flows', 'interactive', 'matrices', 'string suffix structures', 'fft', 'graph matchings', 'ternary search', 'expression parsing', 'meet-in-the-middle', '2-sat', 'chinese remainder theorem', 'schedules'];

const problemSchema = new mongoose.Schema({
    contestId: {
        type: String,
        required: [true, 'A problem must have an contest ID']
    },
    problemNumber: {
        type: String,
        required: [true, 'A problem must have an ID']
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'A problem must belong to a user']
    },
    userName: {
        type: String,
        required: [true, 'A problem must belong to a user']
    },
    folderName: {
        type: String,
        required: [true, 'A problem must belong to a folder']
    },
    folderVisibilty: {
        type: Boolean,
        required: [true, 'A problem\'s folder must have a visibilty']
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    votes: [{
        _id: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        },
        state: Number
    }],
    tags: [{
        type: String,
        enum: problemTags,
        message: `A tag should be one of these tags: ${problemTags}`,
        lowercase: true
    }],
    rating: Number,
    name: {
        type: String,
        required: [true, 'A problem must have a name']
    },
    brief: String,
    verdict: String
});


problemSchema.methods.updateTotalVotes = async function() {
    let sum = 0;
    this.votes.forEach(v => {
        sum += v.state > 0 ? 1 : -1;
    });

    this.totalVotes = sum;
    await this.save();
};

problemSchema.pre(/^delete/, async function(next) {
    const folderName = this.getQuery().folderName;
    const problemsId = await mongoose.model('Problem').find({folderName: folderName}).select('_id');
    await Hint.deleteMany({problemId: {$in: problemsId}});
    await Memento.deleteMany({problemId: {$in: problemsId}});
});

module.exports = mongoose.model('Problem', problemSchema);