const QuizAttempt = require('../models/QuizAttempt');

exports.submitQuizAttempt = async (req, res) => {
    try {
        const { topic, difficulty, score, totalQuestions, answers } = req.body;

        const attempt = new QuizAttempt({
            studentId: req.user._id,
            topic,
            difficulty,
            score,
            totalQuestions,
            answers
        });

        await attempt.save();
        res.status(201).json({ message: 'Quiz attempt saved successfully', attempt });
    } catch (error) {
        console.error('Error saving quiz attempt:', error);
        res.status(500).json({ error: 'Server error while saving quiz attempt' });
    }
};

exports.generateQuizAttempt = async (req, res) => {
    try {
        const { topic, difficulty, numQ } = req.body;
        
        // In a real scenario, this would call an AI model (OpenAI/Google).
        // Since we are in a limited environment, we generate structured mock questions 
        // that feel real based on the requested topic.
        
        const questions = Array.from({ length: numQ || 5 }, (_, i) => ({
            q: `Which of the following describes a core concept of ${topic || 'Computer Science'} within the context of ${difficulty || 'medium'} difficulty?`,
            options: [
                `A specialized ${topic} implementation pattern`,
                `A standard ${difficulty} level approach`,
                `The primary ${topic} optimization technique`,
                `None of the above`
            ],
            correct: Math.floor(Math.random() * 3)
        }));

        res.json({ questions });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
};

exports.getQuizAnalytics = async (req, res) => {
    try {
        // Only faculty and admin should see overall analytics (middleware handles role check generally, but we can be specific)
        const analytics = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: "$topic",
                    attempts: { $sum: 1 },
                    avgScore: { $avg: "$score" },
                    passCount: {
                        $sum: {
                            $cond: [{ $gte: [{ $divide: ["$score", "$totalQuestions"] }, 0.6] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    topic: "$_id",
                    attempts: 1,
                    avgScore: { $round: [{ $multiply: ["$avgScore", { $divide: [100, "$$ROOT.totalQuestions"] }] }, 0] }, // This is tricky since totalQ can vary. Simplified:
                    // Actually, let's just calculate percentage correctly per attempt first if we want true avg %
                    pass: "$passCount",
                    _id: 0
                }
            }
        ]);

        // Refined aggregation to handle percentage correctly
        const refinedAnalytics = await QuizAttempt.aggregate([
            {
                $project: {
                    topic: 1,
                    percentage: { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] },
                    isPass: { $cond: [{ $gte: [{ $divide: ["$score", "$totalQuestions"] }, 0.6] }, 1, 0] }
                }
            },
            {
                $group: {
                    _id: "$topic",
                    attempts: { $sum: 1 },
                    avgScore: { $avg: "$percentage" },
                    pass: { $sum: "$isPass" }
                }
            },
            {
                $project: {
                    topic: "$_id",
                    attempts: 1,
                    avgScore: { $round: ["$avgScore", 0] },
                    pass: 1,
                    _id: 0
                }
            }
        ]);

        res.json(refinedAnalytics);
    } catch (error) {
        console.error('Error fetching quiz analytics:', error);
        res.status(500).json({ error: 'Server error while fetching analytics' });
    }
};

exports.getQuizLeaderboard = async (req, res) => {
    try {
        const leaderboard = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: "$studentId",
                    totalScore: { $sum: "$score" },
                    quizzesTaken: { $sum: 1 },
                    avgPercentage: { $avg: { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] } }
                }
            },
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
                    name: "$studentInfo.name",
                    email: "$studentInfo.email",
                    totalScore: 1,
                    quizzesTaken: 1,
                    avgPercentage: { $round: ["$avgPercentage", 1] },
                    _id: 0
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching quiz leaderboard:', error);
        res.status(500).json({ error: 'Server error while fetching leaderboard' });
    }
};

exports.getPerformanceGaps = async (req, res) => {
    try {
        const gaps = await QuizAttempt.aggregate([
            {
                $project: {
                    topic: 1,
                    percentage: { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] }
                }
            },
            {
                $group: {
                    _id: "$topic",
                    avgScore: { $avg: "$percentage" },
                    totalAttempts: { $sum: 1 }
                }
            },
            {
                $project: {
                    topic: "$_id",
                    avgScore: { $round: ["$avgScore", 1] },
                    totalAttempts: 1,
                    _id: 0
                }
            },
            { $sort: { avgScore: 1 } }, // Show worst performing topics first
            { $limit: 5 }
        ]);

        res.json(gaps);
    } catch (error) {
        console.error('Error fetching performance gaps:', error);
        res.status(500).json({ error: 'Server error while fetching gaps' });
    }
};
