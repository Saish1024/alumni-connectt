const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// Same logic as controller
async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        const QuizAttempt = mongoose.model('QuizAttempt', new mongoose.Schema({}, { strict: false }));

        console.log('--- LEADERBOARD VERIFICATION ---');
        const leaderboard = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: "$studentId",
                    totalScore: { $sum: "$score" },
                    quizzesTaken: { $sum: 1 },
                    avgPercentage: { $avg: { $multiply: [{ $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] }, 100] } }
                }
            }
        ]);
        console.log(JSON.stringify(leaderboard, null, 2));

        console.log('--- GAPS VERIFICATION ---');
        const gaps = await QuizAttempt.aggregate([
            {
                $project: {
                    topic: 1,
                    percentage: { $multiply: [{ $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] }, 100] }
                }
            },
            {
                $group: {
                    _id: "$topic",
                    avgScore: { $avg: "$percentage" }
                }
            }
        ]);
        console.log(JSON.stringify(gaps, null, 2));

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
