const mongoose = require('mongoose');

const donationCampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  donorsCount: { type: Number, default: 0 },
  endDate: { type: Date, required: true },
  icon: { type: String, default: '🎓' },
  color: { type: String, default: 'from-blue-500 to-indigo-600' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonationCampaign', donationCampaignSchema);
