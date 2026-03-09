const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin', 'faculty'], default: 'student' },
  profileImage: { type: String, default: '' },
  batchYear: { type: String },
  company: { type: String },
  jobTitle: { type: String },
  industry: { type: String },
  location: { type: String },
  skills: { type: [String], default: [] },
  bio: { type: String },
  linkedin: { type: String },
  isApproved: { type: Boolean, default: false }, // Only relevant for Alumni, must be approved by Admin
  googleTokens: { type: Object, default: {} },
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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

module.exports = mongoose.model('User', userSchema);
