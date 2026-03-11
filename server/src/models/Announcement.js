const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { 
        type: String, 
        enum: ['normal', 'high', 'urgent'], 
        default: 'normal' 
    },
    audience: { 
        type: String, 
        enum: ['All', 'Students', 'Alumni', 'Faculty'], 
        default: 'All' 
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

module.exports = mongoose.model('Announcement', announcementSchema);
