const mongoose = require('mongoose');
const Config = require('../models/Config');
require('dotenv').config();

const defaultConfig = [
    {
        key: 'platform_upi_id',
        value: 'alumni-connect@upi',
        description: 'Primary UPI ID for all inbound platform payments and donations'
    },
    {
        key: 'platform_bank_details',
        value: {
            bankName: 'State Bank of India',
            accountName: 'Alumni Connect Foundation',
            accountNo: '123456789012',
            ifscCode: 'SBIN0001234'
        },
        description: 'Primary Bank Details for platform payments'
    }
];

const seedConfigs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-connect');
        console.log('✅ Connected to MongoDB for config seeding');

        for (const item of defaultConfig) {
            const exists = await Config.findOne({ key: item.key });
            if (!exists) {
                await Config.create(item);
                console.log(`✨ Created config: ${item.key}`);
            } else {
                console.log(`ℹ️ Config exists: ${item.key}`);
            }
        }

        console.log('✅ Seeding complete');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        await mongoose.connection.close();
    }
};

seedConfigs();
