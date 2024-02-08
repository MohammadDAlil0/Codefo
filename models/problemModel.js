const mongoose = require('mongoose');

const problemTags = ['DP', 'Greedy', 'Graph', 'Data Structures', 'Strings', 'Number Theory', 'Divide and Conquer', 'Binary Search', 'Backtracking', 'Geometry', 'Bit Manipulation', 'Network Flow', 'Combinatorics', 'Mathematics', 'Game Theory', 'Simulation', 'DP on Trees', 'Segment Trees', 'Disjoint Set Union', 'Topological Sorting', 'Shortest Paths', 'Minimum Spanning Tree', 'Hashing', 'Trie', 'Suffix Array', 'Two Pointers', 'Knapsack', 'Meet in the Middle', 'Compressed Data Structures', 'Heavy-Light Decomposition', 'Centroid Decomposition', 'Matrix Exponentiation', 'Convex Hull', 'Sweep Line', 'Randomized Algorithms', 'Approximation Algorithms', 'String Matching', 'Computational Geometry'];

const problemSchema = new mongoose.Schema({
    contestId: {
        type: String,
        required: [true, 'A problem must have an contest ID']
    },
    problemId: {
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
        required: [true, 'A problem must belongs to a user']
    },
    folderName: {
        type: String,
        required: [true, 'A problem must belongs to a folder']
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
        message: `A tag should be one of these tags: ${problemTags}`
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

module.exports = mongoose.model('Problem', problemSchema);