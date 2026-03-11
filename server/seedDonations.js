const mongoose = require('mongoose');
const DonationCampaign = require('./src/models/DonationCampaign');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni-connect';

const seedCampaigns = [
  {
    title: 'Scholarship Fund for Meritorious Students',
    description: 'Aiming to support 10 gifted students from underprivileged backgrounds with their tuition fees for the next academic year.',
    goalAmount: 500000,
    raisedAmount: 285000,
    donorsCount: 142,
    endDate: new Date('2026-06-30'),
    icon: '🎓',
    color: 'from-blue-500 to-indigo-600',
    status: 'active'
  },
  {
    title: 'New Computer Lab Equipment',
    description: 'Upgrading the CS department lab with latest AI-ready workstations and high-speed networking equipment.',
    goalAmount: 200000,
    raisedAmount: 148000,
    donorsCount: 89,
    endDate: new Date('2026-04-15'),
    icon: '💻',
    color: 'from-purple-500 to-violet-600',
    status: 'active'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check if campaigns already exist
    const count = await DonationCampaign.countDocuments();
    if (count > 0) {
      console.log('Campaigns already exist, skipping seed.');
    } else {
      await DonationCampaign.insertMany(seedCampaigns);
      console.log('Seeded initial campaigns successfully!');
    }
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
