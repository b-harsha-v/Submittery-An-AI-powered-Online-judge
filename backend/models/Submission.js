// backend/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    verdict: {
        type: String,
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
        default: 'Pending',
    },
    output: {
        type: String,
    },
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;