const mongoose = require('mongoose');
const User = require('../server/src/models/User');
const QuizAttempt = require('../server/src/models/QuizAttempt');
const Event = require('../server/src/models/Event');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('--- Database Stats ---');
        
        const students = await User.countDocuments({ role: 'student' });
        console.log('Students:', students);
        
        const sessions = await Event.countDocuments({ type: 'session' });
        console.log('Sessions:', sessions);
        
        const quizAttempts = await QuizAttempt.find().limit(10);
        console.log('Recent Quiz Attempts:', JSON.stringify(quizAttempts, null, 2));
        
        const avgScoreAgg = await QuizAttempt.aggregate([
            {
                $group: {
                    _id: null,
                    avgRawScore: { $avg: "$score" },
                    avgTotalQ: { $avg: "$totalQuestions" },
                    avgPct: { $avg: { $multiply: [{ $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] }, 100] } }
                }
            }
        ]);
        console.log('Aggregation Result:', JSON.stringify(avgScoreAgg, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

checkData();
