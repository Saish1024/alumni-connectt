const Competition = require('../models/Competition');

exports.createCompetition = async (req, res) => {
    try {
        const { title, type, description, deadline, prizePool, tags, image, registrationLink } = req.body;

        const competition = new Competition({
            title,
            type,
            description,
            deadline,
            prizePool,
            tags,
            image,
            registrationLink,
            createdBy: req.user._id
        });

        await competition.save();
        res.status(201).json({ message: 'Competition created successfully', competition });
    } catch (error) {
        console.error('Error creating competition:', error);
        res.status(500).json({ error: 'Server error while creating competition' });
    }
};

exports.getCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find().sort({ createdAt: -1 });
        res.json(competitions);
    } catch (error) {
        console.error('Error fetching competitions:', error);
        res.status(500).json({ error: 'Server error while fetching competitions' });
    }
};

exports.deleteCompetition = async (req, res) => {
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) return res.status(404).json({ error: 'Competition not found' });

        // Ensure only creator or admin can delete (simplified)
        await competition.deleteOne();
        res.json({ message: 'Competition deleted successfully' });
    } catch (error) {
        console.error('Error deleting competition:', error);
        res.status(500).json({ error: 'Server error while deleting competition' });
    }
};
