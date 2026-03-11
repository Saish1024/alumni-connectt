const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server/.env') });

// Manually define schema to avoid missing model error
const userSchema = new mongoose.Schema({
  role: String,
  isApproved: Boolean
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found in .env');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        const total = await User.countDocuments();
        const alumni = await User.countDocuments({ role: 'alumni' });
        const approvedAlumni = await User.countDocuments({ role: 'alumni', isApproved: true });
        const pendingAlumni = await User.countDocuments({ role: 'alumni', isApproved: false });
        
        console.log('--- User Diagnostic ---');
        console.log(`Total Users: ${total}`);
        console.log(`Total Alumni: ${alumni}`);
        console.log(`Approved Alumni: ${approvedAlumni}`);
        console.log(`Pending Alumni: ${pendingAlumni}`);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkUsers();
