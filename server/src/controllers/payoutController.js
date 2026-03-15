const Payout = require('../models/Payout');
const Event = require('../models/Event');
const User = require('../models/User');
const Config = require('../models/Config');

// Get Earnings Summary & History
exports.getEarnings = async (req, res) => {
    try {
        const alumniId = req.user._id;

        // 1. All completed paid sessions where student payment is verified
        const earningsHistory = await Event.find({
            organizer: alumniId,
            status: 'completed',
            paymentType: 'paid',
            studentPaymentStatus: 'received'
        }).populate('attendees', 'name email');

        const totalEarned = earningsHistory.reduce((sum, session) => sum + (session.amount || 0), 0);

        // 2. All payout requests
        const payoutHistory = await Payout.find({ alumni: alumniId }).sort({ createdAt: -1 });
        
        const totalWithdrawn = payoutHistory
            .filter(p => ['completed', 'pending'].includes(p.status))
            .reduce((sum, p) => sum + p.amount, 0);

        const currentBalance = totalEarned - totalWithdrawn;

        res.json({
            summary: {
                totalEarned,
                totalWithdrawn,
                currentBalance
            },
            earningsHistory,
            payoutHistory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Confirm student payment for a session
exports.confirmStudentPayment = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Session not found' });
        
        event.studentPaymentStatus = 'received';
        await event.save();
        
        res.json({ message: 'Student payment confirmed', event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get all paid sessions for verification
exports.getInboundPayments = async (req, res) => {
    try {
        const sessions = await Event.find({ paymentType: 'paid' })
            .populate('organizer', 'name email')
            .populate('attendees', 'name email')
            .sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Request Payout
exports.requestPayout = async (req, res) => {
    try {
        const { amount, method } = req.body;
        const alumniId = req.user._id;

        // Check balance
        const earnings = await Event.find({ organizer: alumniId, status: 'completed', paymentType: 'paid' });
        const totalEarned = earnings.reduce((sum, s) => sum + (s.amount || 0), 0);
        
        const payouts = await Payout.find({ alumni: alumniId, status: { $in: ['pending', 'completed'] } });
        const totalWithdrawn = payouts.reduce((sum, p) => sum + p.amount, 0);
        
        const balance = totalEarned - totalWithdrawn;

        if (amount > balance) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        if (amount < 500) {
            return res.status(400).json({ error: 'Minimum payout is ₹500' });
        }

        const user = await User.findById(alumniId);
        
        // Define the payment method details based on what the user chose or their default profile settings
        const payoutMethod = method || { 
            type: user.paymentInfo?.upiId ? 'UPI' : 'Bank Transfer', 
            details: user.paymentInfo?.upiId || '',
            bankDetails: user.paymentInfo?.bankDetails || {}
        };

        const payout = new Payout({
            alumni: alumniId,
            amount,
            paymentMethod: payoutMethod
        });

        await payout.save();
        res.status(201).json(payout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Payment Info
exports.updatePaymentInfo = async (req, res) => {
    try {
        const { upiId, bankDetails } = req.body;
        const user = await User.findById(req.user._id);
        
        if (upiId !== undefined) user.paymentInfo.upiId = upiId;
        if (bankDetails) user.paymentInfo.bankDetails = { ...user.paymentInfo.bankDetails, ...bankDetails };

        await user.save();
        res.json({ message: 'Payment info updated successfully', paymentInfo: user.paymentInfo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get all payout requests
exports.getAllPayouts = async (req, res) => {
    try {
        const payouts = await Payout.find().populate('alumni', 'name email').sort({ createdAt: -1 });
        res.json(payouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Process Payout
exports.processPayout = async (req, res) => {
    try {
        const { status } = req.body;
        const payout = await Payout.findById(req.params.id);
        
        if (!payout) return res.status(404).json({ error: 'Payout request not found' });
        
        payout.status = status;
        payout.processedAt = new Date();
        await payout.save();
        
        res.json(payout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Platform Configuration & Revenue ---

// Admin: Get platform config
exports.getPlatformConfig = async (req, res) => {
    try {
        const configs = await Config.find();
        const configMap = configs.reduce((acc, c) => ({ ...acc, [c.key]: c.value }), {});
        res.json(configMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin/Public: Get specific config key
exports.getConfigByKey = async (req, res) => {
    try {
        const config = await Config.findOne({ key: req.params.key });
        if (!config) {
            // Provide a default fallback if not configured in DB
            if (req.params.key === 'platform_upi_id') {
                return res.json({ key: 'platform_upi_id', value: 'alumni-connect@upi' });
            }
            return res.status(404).json({ error: 'Config not found' });
        }
        res.json({ key: config.key, value: config.value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Update platform config
exports.updatePlatformConfig = async (req, res) => {
    try {
        const { key, value } = req.body;
        console.log(`[ConfigUpdate] Attempting to update ${key} to ${value}`);
        
        let config = await Config.findOne({ key });
        if (config) {
            config.value = value;
            config.updatedAt = new Date();
        } else {
            config = new Config({ key, value });
        }
        await config.save();
        console.log(`[ConfigUpdate] Successfully updated ${key}`);
        res.json(config);
    } catch (error) {
        console.error(`[ConfigUpdate] Error updating config:`, error);
        res.status(500).json({ error: error.message });
    }
};

// Admin: Get Financial Overview (Real-time)
exports.getFinancialOverview = async (req, res) => {
    try {
        // Total platform revenue: Sum of all verified student payments
        const verifiedSessions = await Event.find({ 
            paymentType: 'paid', 
            studentPaymentStatus: 'received' 
        });
        const platformRevenue = verifiedSessions.reduce((sum, s) => sum + (s.amount || 0), 0);

        // Total payouts: Sum of all completed payout requests
        const completedPayouts = await Payout.find({ status: 'completed' });
        const totalPayouts = completedPayouts.reduce((sum, p) => sum + p.amount, 0);

        // Active/Pending Queue stats
        const pendingPayoutsCount = await Payout.countDocuments({ status: 'pending' });
        const pendingInboundCount = await Event.countDocuments({ 
            paymentType: 'paid', 
            studentPaymentStatus: 'pending' 
        });

        res.json({
            platformRevenue,
            totalPayouts,
            pendingPayoutsCount,
            pendingInboundCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
