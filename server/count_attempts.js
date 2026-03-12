const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Define a minimal schema
        const QuizAttempt = mongoose.model('QuizAttempt', new mongoose.Schema({}, { strict: false }));
        
        const count = await QuizAttempt.countDocuments();
        console.log('QUIZ_ATTEMPT_COUNT:' + count);
        
        if (count > 0) {
            const latest = await QuizAttempt.find().sort({ createdAt: -1 }).limit(1);
            console.log('LATEST_ATTEMPT:' + JSON.stringify(latest));
        }
        
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
