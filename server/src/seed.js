const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const users = [
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        isApproved: true,
    },
    {
        name: 'Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        isApproved: true,
    },
    {
        name: 'Alumni',
        email: 'alumni@example.com',
        password: 'password123',
        role: 'alumni',
        isApproved: true,
    },
    {
        name: 'Faculty',
        email: 'faculty@example.com',
        password: 'password123',
        role: 'faculty',
        isApproved: true,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-connect');
        console.log('✅ Connected to MongoDB for seeding');

        for (const userData of users) {
            const userExists = await User.findOne({ email: userData.email });
            if (!userExists) {
                const user = new User(userData);
                await user.save();
                console.log(`👤 User created: ${userData.name} (${userData.role})`);
            } else {
                // Update password for existing ones if needed
                userExists.password = userData.password;
                userExists.role = userData.role;
                userExists.isApproved = userData.isApproved;
                await userExists.save();
                console.log(`🔄 User updated: ${userData.name} (${userData.role})`);
            }
        }

        console.log('✅ Database seeded successfully!');
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();
