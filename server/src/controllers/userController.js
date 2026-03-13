const User = require('../models/User');
const Event = require('../models/Event');
const QuizAttempt = require('../models/QuizAttempt');
const Job = require('../models/Job');

// GET /api/users - get all alumni (for directory)
const getUsers = async (req, res) => {
    try {
        const { search, industry, batchYear, role } = req.query;
        
        // Default filter: only approved users
        const filter = { isApproved: true };

        // If user is Admin or Faculty, they can see ALL users (including pending)
        if (req.user && (req.user.role === 'admin' || req.user.role === 'faculty')) {
            delete filter.isApproved;
        }

        if (role) filter.role = role;
        if (batchYear) filter.batchYear = batchYear;
        if (industry) filter.industry = industry;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } },
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/:id - get single user
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').lean();
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/profile - update current user profile
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        // Prevent role/approval changes via this route
        delete updates.role;
        delete updates.isApproved;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/pending - get users awaiting approval (Admin only)
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ isApproved: false }).select('-password').sort({ createdAt: -1 }).lean();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/:id/approve - approve a user (Admin only)
const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /api/users/:id - delete a user (Admin only)
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/:id - update any user (Admin only)
const adminUpdateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/student-stats - get stats for student dashboard
const getStudentStats = async (req, res) => {
    try {
        const studentId = req.user._id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

        // 1. Basic Stats
        const sessionsBooked = await Event.countDocuments({ attendees: studentId, type: 'session' });
        const monthlySessions = await Event.countDocuments({ 
            attendees: studentId, 
            type: 'session',
            createdAt: { $gte: startOfMonth }
        });

        const quizzesTaken = await QuizAttempt.countDocuments({ studentId });
        const weeklyQuizzes = await QuizAttempt.countDocuments({
            studentId,
            createdAt: { $gte: startOfWeek }
        });

        const jobsApplied = await Job.countDocuments({ applicants: studentId });
        // Mocking interview count for now as it's not in the model
        const interviewCount = Math.floor(jobsApplied / 3);

        const user = await User.findById(studentId);
        const totalPoints = user.totalPoints || 0;
        const streak = user.streak || 0;

        // Rank calculation
        const rank = await User.countDocuments({ totalPoints: { $gt: totalPoints } }) + 1;

        // 2. Weekly Activity (Last 7 Days)
        const activityData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const startOfDay = new Date(d.setHours(0, 0, 0, 0));
            const endOfDay = new Date(d.setHours(23, 59, 59, 999));

            const dayQuizzes = await QuizAttempt.find({
                studentId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).lean();

            const dayScore = dayQuizzes.length > 0 
                ? Math.round(dayQuizzes.reduce((sum, q) => sum + (q.score / q.totalQuestions * 100), 0) / dayQuizzes.length)
                : 0;

            activityData.push({
                day: days[startOfDay.getDay()],
                sessions: await Event.countDocuments({ attendees: studentId, type: 'session', createdAt: { $gte: startOfDay, $lte: endOfDay } }),
                quizzes: dayQuizzes.length,
                score: dayScore
            });
        }

        // 3. Topics Practiced (Pie Chart)
        const attempts = await QuizAttempt.find({ studentId }).lean();
        const topicCounts = {};
        attempts.forEach(a => {
            topicCounts[a.topic] = (topicCounts[a.topic] || 0) + 1;
        });
        const totalAttempts = attempts.length || 1;
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        const topicData = Object.entries(topicCounts).map(([name, count], i) => ({
            name,
            value: Math.round((count / totalAttempts) * 100),
            color: colors[i % colors.length]
        })).sort((a, b) => b.value - a.value).slice(0, 5);

        // 4. Recommended Mentors (3)
        const aiMentors = await User.find({ role: 'alumni', isApproved: true })
            .limit(3)
            .select('name jobTitle company skills averageRating profileImage sessionPrice linkedin')
            .lean();

        // 5. Upcoming Sessions (2)
        const upcomingSessions = await Event.find({
            attendees: studentId,
            status: 'upcoming'
        }).populate('organizer', 'name profileImage').sort({ date: 1, time: 1 }).limit(2).lean();

        res.status(200).json({
            topStats: {
                sessionsBooked,
                monthlySessions,
                quizzesTaken,
                weeklyQuizzes,
                jobsApplied,
                interviewCount,
                totalPoints,
                streak,
                rank
            },
            activityData,
            topicData,
            aiMentors: aiMentors.map(m => ({
                id: m._id,
                name: m.name,
                role: m.jobTitle + (m.company ? ` @ ${m.company}` : ''),
                skills: m.skills,
                rating: m.averageRating || 4.5,
                free: m.sessionPrice === 0,
                price: m.sessionPrice,
                img: m.profileImage,
                linkedin: m.linkedin,
                available: true
            })),
            upcomingSessions: upcomingSessions.map(s => ({
                id: s._id,
                mentor: s.organizer?.name || 'Mentor',
                topic: s.title,
                date: s.date,
                time: s.time,
                status: s.status,
                img: s.organizer?.profileImage
            }))
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/users/leaderboard - get ranked students
const getLeaderboard = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('name totalPoints streak profileImage')
            .sort({ totalPoints: -1, streak: -1 })
            .limit(50)
            .lean();

        const leaderboard = await Promise.all(students.map(async (student, index) => {
            const quizzes = await QuizAttempt.countDocuments({ studentId: student._id });
            // Badges logic: 1 badge per 1000 points + 1 per 5 quizzes
            const badges = Math.floor((student.totalPoints || 0) / 1000) + Math.floor(quizzes / 5);
            
            return {
                rank: index + 1,
                id: student._id,
                name: student.name,
                points: student.totalPoints || 0,
                streak: student.streak || 0,
                quizzes,
                badges,
                img: student.profileImage
            };
        }));

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getUsers, 
    getUserById, 
    updateProfile, 
    approveUser, 
    deleteUser, 
    getPendingUsers, 
    adminUpdateUser,
    getStudentStats,
    getLeaderboard
};
