const User = require('../models/User');
const Event = require('../models/Event');
const Payout = require('../models/Payout');

// Admin: Get Dashboard Analytics
exports.getDashboardAnalytics = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // 1. Revenue Trends (Last 6 Months)
        const revenueTrends = await Event.aggregate([
            {
                $match: {
                    paymentType: 'paid',
                    studentPaymentStatus: 'received',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 2. User Growth Trends (Last 6 Months)
        const userGrowthTrends = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        role: "$role"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 3. User Role Distribution
        const roleDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format for Frontend
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6Months.push({
                month: monthNames[d.getMonth()],
                year: d.getFullYear(),
                monthIndex: d.getMonth() + 1
            });
        }

        const formattedRevenue = last6Months.map(m => {
            const match = revenueTrends.find(r => r._id.month === m.monthIndex && r._id.year === m.year);
            return { month: m.month, revenue: match ? match.revenue : 0 };
        });

        const formattedGrowth = last6Months.map(m => {
            const roles = ['student', 'alumni', 'faculty', 'admin'];
            const data = { month: m.month };
            roles.forEach(role => {
                const match = userGrowthTrends.find(g => g._id.month === m.monthIndex && g._id.year === m.year && g._id.role === role);
                data[role] = match ? match.count : 0;
            });
            return data;
        });

        const totalUsers = roleDistribution.reduce((sum, r) => sum + r.count, 0);
        const formattedRoles = roleDistribution.map(r => ({
            name: r._id.charAt(0).toUpperCase() + r._id.slice(1) + 's',
            value: totalUsers > 0 ? Math.round((r.count / totalUsers) * 100) : 0,
            count: r.count,
            color: r._id === 'student' ? '#6366f1' : r._id === 'alumni' ? '#8b5cf6' : r._id === 'faculty' ? '#06b6d4' : '#10b981'
        }));

        res.json({
            revenueData: formattedRevenue,
            userGrowthData: formattedGrowth,
            roleDistribution: formattedRoles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Admin: Get Detailed Revenue Analytics
exports.getRevenueAnalytics = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // 1. Monthly Revenue & Session Counts (Last 6 Months)
        const monthlyStats = await Event.aggregate([
            {
                $match: {
                    paymentType: 'paid',
                    studentPaymentStatus: 'received',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" },
                    sessions: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 2. Category Breakdown
        const categoryBreakdown = await Event.aggregate([
            {
                $match: {
                    paymentType: 'paid',
                    studentPaymentStatus: 'received'
                }
            },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        // Format month names and align with stats
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            last6Months.push({
                month: monthNames[d.getMonth()],
                year: d.getFullYear(),
                monthIndex: d.getMonth() + 1
            });
        }

        const formattedMonthly = last6Months.map(m => {
            const match = monthlyStats.find(s => s._id.month === m.monthIndex && s._id.year === m.year);
            return {
                month: m.month,
                revenue: match ? match.revenue : 0,
                sessions: match ? match.sessions : 0
            };
        });

        const totalRevenue = categoryBreakdown.reduce((sum, c) => sum + c.totalAmount, 0);
        const categories = categoryBreakdown.map(c => ({
            label: c._id === 'session' ? 'Mentoring Sessions' : 'Events & Webinars',
            amount: c.totalAmount,
            share: totalRevenue > 0 ? ((c.totalAmount / totalRevenue) * 100).toFixed(1) : 0,
            icon: c._id === 'session' ? '🎓' : '🎪',
            color: c._id === 'session' ? 'from-indigo-500 to-purple-600' : 'from-green-500 to-emerald-600'
        }));

        res.json({
            revenueData: formattedMonthly,
            categories,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
