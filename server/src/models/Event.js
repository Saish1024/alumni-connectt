const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // Keeping as string for frontend compatibility or Date
    time: { type: String },
    duration: { type: String },
    location: { type: String },
    type: { type: String, enum: ['event', 'session'], default: 'event' },
    paymentType: { type: String, enum: ['free', 'paid'], default: 'free' },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'upcoming', 'completed', 'rejected'], default: 'upcoming' },
    category: { type: String },
    meetLink: { type: String },
    image: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attendance: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now }
    }],
    ratings: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, min: 1, max: 5 },
        feedback: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
