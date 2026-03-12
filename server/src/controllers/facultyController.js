const User = require('../models/User');
const Event = require('../models/Event');
const QuizAttempt = require('../models/QuizAttempt');
const SessionRequest = require('../models/SessionRequest');

exports.createSessionRequest = async (req, res) => {
    try {
        const { topic, description } = req.body;
        const facultyId = req.user.id;

        const request = new SessionRequest({
            faculty: facultyId,
            topic,
            description
        });

        await request.save();
        res.status(201).json({ message: 'Session request created successfully', request });
    } catch (error) {
        console.error('Error creating session request:', error);
        res.status(500).json({ error: 'Server error while creating session request' });
    }
};

exports.getMySessionRequests = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const requests = await SessionRequest.find({ faculty: facultyId })
            .populate('acceptingAlumni', 'name email profileImage')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching session requests:', error);
        res.status(500).json({ error: 'Server error while fetching session requests' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Active Students
        const activeStudentsCount = await User.countDocuments({ role: 'student' });

        // 2. Sessions This Month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const sessionsThisMonthCount = await Event.countDocuments({
            type: 'session',
            createdAt: { $gte: startOfMonth }
        });

        // 3. Average Quiz Score
        const quizStats = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: { $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] } }
                }
            }
        ]);
        const avgQuizScore = quizStats.length > 0 ? Math.round(quizStats[0].avgScore * 100) : 0;

        // 4. Performance Trends (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const trends = await QuizAttempt.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    avg: { $avg: { $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] } },
                    month: { $first: { $dateToString: { format: "%b", date: "$createdAt" } } },
                    date: { $first: "$createdAt" }
                }
            },
            { $sort: { date: 1 } },
            {
                $project: {
                    month: 1,
                    avg: { $round: [{ $multiply: ["$avg", 100] }, 0] }
                }
            }
        ]);

        // 5. Top Students (Engagement & Performance)
        const topStudents = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: "$studentId",
                    avgScore: { $avg: { $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] } },
                    totalQuizzes: { $sum: 1 }
                }
            },
            { $sort: { avgScore: -1, totalQuizzes: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            { $unwind: "$studentInfo" },
            {
                $project: {
                    id: "$_id",
                    name: "$studentInfo.name",
                    branch: "$studentInfo.major",
                    year: "$studentInfo.batchYear",
                    avgScore: { $round: [{ $multiply: ["$avgScore", 100] }, 0] },
                    progress: { $round: [{ $multiply: ["$avgScore", 100] }, 0] } // Mock progress as avg score for now
                }
            }
        ]);

        // Fetch session counts for top students
        for (let student of topStudents) {
            student.sessionsAttended = await Event.countDocuments({
                type: 'session',
                attendees: student.id
            });
        }

        res.json({
            activeStudentsCount,
            sessionsThisMonthCount,
            avgQuizScore,
            trends,
            topStudents
        });
    } catch (error) {
        console.error('Error fetching faculty stats:', error);
        res.status(500).json({ error: 'Server error while fetching dashboard stats' });
    }
};
