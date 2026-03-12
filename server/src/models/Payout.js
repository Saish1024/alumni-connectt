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
        details: { type: String }, // For UPI ID
        bankDetails: {
            accountHolder: { type: String },
            accountNumber: { type: String },
            ifscCode: { type: String },
            bankName: { type: String }
        }
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
