const Event = require('../models/Event');
const User = require('../models/User');
const ResumeReview = require('../models/ResumeReview');
const mongoose = require('mongoose');

const getAlumniStats = async (req, res) => {
    try {
        const alumniId = req.user._id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // 1. Basic Stats (Top Cards)
        const allCompletedSessions = await Event.find({
            organizer: alumniId,
            status: 'completed'
        });

        const totalEarnings = allCompletedSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
        const sessionsDone = allCompletedSessions.length;

        const monthlyCompletedSessions = allCompletedSessions.filter(s => new Date(s.createdAt) >= startOfMonth);
        const monthlyEarnings = monthlyCompletedSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
        const monthlySessionsCount = monthlyCompletedSessions.length;

        // Avg Rating
        const user = await User.findById(alumniId);
        const avgRating = user.averageRating || 0;
        const ratingCount = user.ratingCount || 0;

        // Students Helped & Colleges
        const studentIds = [...new Set(allCompletedSessions.flatMap(s => s.attendees.map(id => id.toString())))];
        const studentsHelped = studentIds.length;

        // Count colleges from helped students
        const students = await User.find({ _id: { $in: studentIds } }, 'institution department');
        const collegesHelped = [...new Set(students.map(s => s.institution).filter(Boolean))].length;

        // 2. Earnings Trend (Last 7 Months)
        const earningsData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthSessions = allCompletedSessions.filter(s => {
                const sDate = new Date(s.createdAt);
                return sDate >= d && sDate < nextD;
            });
            const monthEarned = monthSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
            earningsData.push({
                month: d.toLocaleString('default', { month: 'short' }),
                earned: monthEarned
            });
        }

        // 3. Sessions by Topic
        const topicMap = {};
        allCompletedSessions.forEach(s => {
            const cat = s.category || 'Mentoring';
            topicMap[cat] = (topicMap[cat] || 0) + 1;
        });
        const totalSessions = sessionsDone || 1;
        const topicData = Object.entries(topicMap).map(([name, count]) => ({
            name,
            value: Math.round((count / totalSessions) * 100)
        })).sort((a, b) => b.value - a.value);

        // 4. Upcoming Sessions (3)
        const upcomingSessions = await Event.find({
            organizer: alumniId,
            status: 'upcoming'
        }).populate('attendees', 'name').sort({ date: 1, time: 1 }).limit(3);

        const upcomingFormatted = upcomingSessions.map(s => ({
            id: s._id,
            student: s.attendees[0]?.name || 'Student',
            topic: s.title,
            date: s.date,
            time: s.time,
            type: s.paymentType,
            amount: s.amount || 0
        }));

        // 5. Pending Resume Reviews (3)
        const pendingReviews = await ResumeReview.find({
            alumni: alumniId,
            status: 'pending'
        }).populate('student', 'name institution department major').sort({ createdAt: -1 }).limit(3);

        const reviewsFormatted = pendingReviews.map(r => ({
            id: r._id,
            student: r.student?.name || 'Student',
            college: r.student?.institution || 'Unknown College',
            request: r.resumeName || 'Resume Review',
            time: formatTimeAgo(r.createdAt)
        }));

        res.status(200).json({
            topStats: {
                totalEarnings,
                monthlyEarnings,
                sessionsDone,
                monthlySessions: monthlySessionsCount,
                avgRating,
                ratingCount,
                studentsHelped,
                collegesHelped
            },
            earningsData,
            topicData,
            upcomingSessions: upcomingFormatted,
            pendingReviews: reviewsFormatted
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hrs ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " secs ago";
}

module.exports = { getAlumniStats };
