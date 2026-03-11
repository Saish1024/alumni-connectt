const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationCampaign', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  transactionId: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
