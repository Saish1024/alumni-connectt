const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin', 'faculty'], default: 'student' },
  profileImage: { type: String, default: '' },
  batchYear: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  company: { type: String, required: function() { return this.role === 'alumni'; } },
  jobTitle: { type: String, required: function() { return ['alumni', 'faculty'].includes(this.role); } },
  industry: { type: String, required: true },
  location: { type: String },
  skills: { type: [String], default: [] },
  bio: { type: String },
  linkedin: { type: String, required: function() { return this.role === 'alumni'; } },
  isApproved: { type: Boolean, default: false }, // Only relevant for Alumni, must be approved by Admin
  googleTokens: { type: Object, default: {} },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  paymentInfo: {
    upiId: { type: String, default: '' },
    bankDetails: {
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
      accountHolder: { type: String, default: '' }
    }
  },
  // Mentoring Setup
  sessionPrice: { type: Number, default: 0 },
  resumeReviewPrice: { type: Number, default: 0 },
  mentoringTopics: { type: [String], default: [] },
  availability: {
    type: Map,
    of: [String],
    default: {
      'Monday': ['10:00 AM', '02:00 PM', '04:00 PM'],
      'Tuesday': ['10:00 AM', '02:00 PM', '04:00 PM'],
      'Wednesday': ['10:00 AM', '02:00 PM', '04:00 PM'],
      'Thursday': ['10:00 AM', '02:00 PM', '04:00 PM'],
      'Friday': ['10:00 AM', '02:00 PM', '04:00 PM'],
      'Saturday': [],
      'Sunday': []
    }
  },
  // Gamification
  totalPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  notificationSettings: {
    connectionRequests: { type: Boolean, default: true },
    newMessages: { type: Boolean, default: true },
    jobAlerts: { type: Boolean, default: true },
    upcomingSessions: { type: Boolean, default: true }
  },
  privacySettings: {
    directoryVisibility: { type: Boolean, default: true },
    calendarSync: { type: Boolean, default: true },
    activeStatus: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add indexes for performance
userSchema.index({ role: 1 });
userSchema.index({ industry: 1 });
userSchema.index({ isApproved: 1 });

module.exports = mongoose.model('User', userSchema);
