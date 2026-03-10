const Job = require('../models/Job');

const createJob = async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            postedBy: req.user._id
        });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name company profileImage');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        if (job.applicants.includes(req.user._id)) {
            return res.status(400).json({ error: 'Already applied' });
        }

        job.applicants.push(req.user._id);
        await job.save();
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createJob, getJobs, applyForJob };
