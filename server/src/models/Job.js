const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    salary: { type: String },
    type: { type: String, default: 'Full-time' },
    deadline: { type: String },
    applicationLink: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

// Add indexes for performance
jobSchema.index({ type: 1 });
jobSchema.index({ location: 1 });

module.exports = mongoose.model('Job', jobSchema);
