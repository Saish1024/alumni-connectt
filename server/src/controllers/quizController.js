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
