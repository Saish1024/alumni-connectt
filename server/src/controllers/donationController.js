const DonationCampaign = require('../models/DonationCampaign');
const Donation = require('../models/Donation');

// Get all active campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await DonationCampaign.find({ status: 'active' }).sort({ endDate: 1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a donation attempt
exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, transactionId } = req.body;
    
    const donation = new Donation({
      campaignId,
      userId: req.user.id,
      amount,
      transactionId,
      paymentStatus: 'pending' // Admin will verify this
    });

    await donation.save();
    
    // Optionally increment raisedAmount immediately or wait for verification
    // For now, let's wait for verification to update the campaign total
    
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get logged-in user's donation history
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id })
      .populate('campaignId', 'title icon color')
      .sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create a new campaign
exports.adminCreateCampaign = async (req, res) => {
  try {
    const campaign = new DonationCampaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Verify a donation and update campaign totals
exports.verifyDonation = async (req, res) => {
  try {
    const { donationId, status } = req.body; // 'verified' or 'rejected'
    const donation = await Donation.findById(donationId);
    
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.paymentStatus !== 'pending') return res.status(400).json({ message: 'Donation already processed' });

    donation.paymentStatus = status;
    await donation.save();

    if (status === 'verified') {
      await DonationCampaign.findByIdAndUpdate(donation.campaignId, {
        $inc: { raisedAmount: donation.amount, donorsCount: 1 }
      });
    }

    res.json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
