const Announcement = require('../models/Announcement');

// Admin: Create announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, content, priority, audience } = req.body;
        const announcement = new Announcement({
            title,
            content,
            priority,
            audience,
            author: req.user._id
        });
        await announcement.save();
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get announcements based on user role
exports.getAnnouncements = async (req, res) => {
    try {
        const { role } = req.user;
        let audienceFilter = ['All'];
        
        if (role === 'student') audienceFilter.push('Students');
        if (role === 'alumni') audienceFilter.push('Alumni');
        if (role === 'faculty') audienceFilter.push('Faculty');
        if (role === 'admin') audienceFilter = ['All', 'Students', 'Alumni', 'Faculty'];

        const announcements = await Announcement.find({ 
            audience: { $in: audienceFilter } 
        }).sort({ createdAt: -1 });

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: Delete announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) return res.status(404).json({ error: 'Announcement not found' });
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
