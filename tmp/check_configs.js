const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const Config = require('../server/src/models/Config');

async function checkConfigs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-connect');
        console.log('Connected to MongoDB');

        const configs = await Config.find();
        console.log('Current Configurations:');
        console.log(JSON.stringify(configs, null, 2));

        const upiConfig = await Config.findOne({ key: 'platformUpiId' });
        if (upiConfig) {
            console.log('\nPlatform UPI config found:', upiConfig.value);
        } else {
            console.log('\nPlatform UPI config NOT found!');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkConfigs();
