const Event = require('../models/Event');
const googleCalendarController = require('./googleCalendarController');

const createEvent = async (req, res) => {
    try {
        let meetLink = req.body.meetLink;

        // If it's a mentoring session and user is authorized, generate real Meet link
        if (req.body.type === 'session' && req.user.googleTokens && req.user.googleTokens.access_token) {
            try {
                meetLink = await googleCalendarController.createMeeting(req.user._id, {
                    topic: req.body.title || req.body.topic,
                    date: req.body.date,
                    time: req.body.time,
                    duration: req.body.duration
                });
            } catch (err) {
                console.error('API Meet Generation failed, falling back to mock:', err);
                // Fallback link if real generation fails
                meetLink = `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 10)}`;
            }
        }

        const event = new Event({
            ...req.body,
            meetLink,
            organizer: req.user._id
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const events = await Event.find(filter).populate('organizer', 'name email profileImage');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registerForEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        if (event.attendees.includes(req.user._id)) {
            return res.status(400).json({ error: 'Already registered' });
        }

        event.attendees.push(req.user._id);
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createEvent, getEvents, registerForEvent };
