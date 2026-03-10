const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // Keeping as string for frontend compatibility or Date
    time: { type: String },
    duration: { type: String },
    location: { type: String },
    type: { type: String, enum: ['event', 'session'], default: 'event' },
    status: { type: String, enum: ['pending', 'upcoming', 'completed', 'rejected'], default: 'upcoming' },
    category: { type: String },
    meetLink: { type: String },
    image: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
