const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const ConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
});

const Config = mongoose.model('Config', ConfigSchema);

async function checkConfig() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni-connect');
        console.log('Connected to MongoDB');
        
        const configs = await Config.find({});
        console.log('All Configurations:');
        console.log(JSON.stringify(configs, null, 2));
        
        const upi = await Config.findOne({ key: 'platformUpiId' });
        console.log('platformUpiId:', upi);
        
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkConfig();
