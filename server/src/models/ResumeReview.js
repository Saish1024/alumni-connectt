const mongoose = require('mongoose');

const resumeReviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    resumeName: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    },
    feedback: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    }
});

module.exports = mongoose.model('ResumeReview', resumeReviewSchema);
