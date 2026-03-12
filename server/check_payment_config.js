const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const Config = mongoose.model('Config', new mongoose.Schema({}, { strict: false }));
        
        const upi = await Config.findOne({ key: 'platform_upi_id' });
        const bank = await Config.findOne({ key: 'platform_bank_details' });
        
        console.log('PLATFORM_UPI:' + (upi ? JSON.stringify(upi.value) : 'NOT_FOUND'));
        console.log('PLATFORM_BANK:' + (bank ? JSON.stringify(bank.value) : 'NOT_FOUND'));
        
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
