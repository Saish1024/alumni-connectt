const mongoose = require('mongoose');
const Notification = require('../server/src/models/Notification');
const User = require('../server/src/models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const createTestNotif = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ role: 'faculty' }); // Target the faculty user
        if (!user) {
            console.error('No faculty user found');
            return;
        }

        await new Notification({
            recipient: user._id,
            text: 'Test Notification: Your institutional dashboard is now live!',
            type: 'success'
        }).save();

        console.log('✅ Test notification created for:', user.name);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

createTestNotif();
