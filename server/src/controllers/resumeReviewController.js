const ResumeReview = require('../models/ResumeReview');
const User = require('../models/User');

// Request a resume review
const requestReview = async (req, res) => {
    try {
        const { alumniId, resumeUrl, resumeName } = req.body;
        const studentId = req.user._id;

        const review = new ResumeReview({
            student: studentId,
            alumni: alumniId,
            resumeUrl,
            resumeName,
            status: 'pending'
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get reviews for an alumni
const getRequestsForAlumni = async (req, res) => {
    try {
        const reviews = await ResumeReview.find({ alumni: req.user._id })
            .populate('student', 'name email profileImage')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get reviews for a student
const getRequestsForStudent = async (req, res) => {
    try {
        const reviews = await ResumeReview.find({ student: req.user._id })
            .populate('alumni', 'name email profileImage company')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Submit feedback
const submitFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const reviewId = req.params.id;

        const review = await ResumeReview.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: 'Review request not found' });
        }

        // Check if the current user is the assigned alumni
        if (review.alumni.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to provide feedback for this request' });
        }

        review.feedback = feedback;
        review.status = 'reviewed';
        review.reviewedAt = Date.now();

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    requestReview,
    getRequestsForAlumni,
    getRequestsForStudent,
    submitFeedback
};
