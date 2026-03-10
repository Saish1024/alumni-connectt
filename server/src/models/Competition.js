const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Hackathon', 'Competition', 'Contest'],
        default: 'Hackathon'
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['ongoing', 'upcoming', 'completed'],
        default: 'upcoming'
    },
    deadline: {
        type: String, // String for simplicity in this flow, or Date
        required: true
    },
    prizePool: {
        type: String
    },
    participantsCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop'
    },
    registrationLink: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Competition', competitionSchema);
