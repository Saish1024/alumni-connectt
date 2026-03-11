const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    alumni: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'pending'
    },
    paymentMethod: {
        type: { type: String, enum: ['UPI', 'Bank Transfer'], default: 'UPI' },
        details: { type: String } // e.g. the UPI ID used at the time of request
    },
    processedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payout', payoutSchema);
