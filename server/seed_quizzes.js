const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// Mock schemas
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    isApproved: Boolean
});

const QuizAttemptSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topic: String,
    score: Number,
    totalQuestions: Number,
    percentage: Number,
    createdAt: { type: Date, default: Date.now }
});

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const User = mongoose.model('User', UserSchema);
        const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);

        // 1. Find some students
        const students = await User.find({ role: 'student' }).limit(5);
        if (students.length === 0) {
            console.log('No students found to seed quizzes for.');
            return;
        }

        console.log(`Found ${students.length} students. Seeding quizzes...`);

        const topics = ['Data Structures', 'Algorithms', 'Web Development', 'Database Systems', 'Machine Learning'];
        const attempts = [];

        for (const student of students) {
            // Give each student 3-5 quiz attempts
            const numQuizzes = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < numQuizzes; i++) {
                const topic = topics[Math.floor(Math.random() * topics.length)];
                // Create some gaps (low scores) in 'Algorithms' and 'Machine Learning'
                let score;
                if (topic === 'Algorithms' || topic === 'Machine Learning') {
                    score = Math.floor(Math.random() * 40); // 0-40%
                } else {
                    score = Math.floor(Math.random() * 50) + 50; // 50-100%
                }

                attempts.push({
                    studentId: student._id,
                    topic: topic,
                    score: score,
                    totalQuestions: 10,
                    percentage: score,
                    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7) // Last 7 days
                });
            }
        }

        await QuizAttempt.insertMany(attempts);
        console.log(`Successfully seeded ${attempts.length} quiz attempts!`);

    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
