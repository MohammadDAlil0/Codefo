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
        required: 'A problem must belongs to a folder'
    },
    votes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
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
    verdict: String,
    hints: [{
        type: mongoose.Types.ObjectId,
        ref: 'Hint'
    }]
});

module.exports = mongoose.model('Problem', problemSchema);