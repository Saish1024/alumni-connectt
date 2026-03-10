const Event = require('../models/Event');
const User = require('../models/User');
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

const refreshSessionStatuses = async () => {
    try {
        const now = new Date();
        const upcomingSessions = await Event.find({
            type: 'session',
            status: 'upcoming'
        });

        for (const session of upcomingSessions) {
            // Parse date and time
            let startDateTime;
            if (session.date.includes('-')) {
                // "2026-03-15T10:20:00"
                startDateTime = new Date(`${session.date}T${session.time}:00`);
            } else {
                startDateTime = new Date(`${session.date} ${session.time}`);
            }

            const durationMin = parseInt(session.duration) || 60;
            const endDateTime = new Date(startDateTime.getTime() + durationMin * 60000);

            if (now > endDateTime) {
                session.status = 'completed';
                await session.save();
                console.log(`✅ Session ${session._id} marked as completed automatically.`);
            }
        }
    } catch (err) {
        console.error('Error refreshing session statuses:', err);
    }
};

const getEvents = async (req, res) => {
    try {
        // Refresh statuses before returning
        await refreshSessionStatuses();

        const { type } = req.query;
        const filter = type ? { type } : {};
        const events = await Event.find(filter)
            .populate('organizer', 'name email profileImage')
            .populate('attendees', 'name email profileImage')
            .populate('attendance.studentId', 'name email profileImage')
            .sort({ createdAt: -1 });
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

const requestSession = async (req, res) => {
    try {
        const { mentorId, date, time, topic, duration, paymentType } = req.body;

        const event = new Event({
            title: topic || 'Mentoring Session',
            description: `Requested Mentoring Session. Topic: ${topic}`,
            date,
            time,
            duration: duration || '60 min',
            type: 'session',
            paymentType: paymentType || 'free',
            status: 'pending',
            organizer: mentorId, // The alumni
            attendees: [req.user._id] // The student requesting
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const acceptSession = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Session not found' });

        // Verify the user accepting is the organizer (alumni)
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to accept this session' });
        }

        let meetLink = event.meetLink;

        // Generate Meet Link
        if (req.user.googleTokens && req.user.googleTokens.access_token) {
            try {
                meetLink = await googleCalendarController.createMeeting(req.user._id, {
                    topic: event.title,
                    date: event.date,
                    time: event.time,
                    duration: event.duration
                });
            } catch (err) {
                console.error('API Meet Generation failed, falling back to mock:', err);
                meetLink = `https://meet.google.com/mock-${Math.random().toString(36).substring(2, 10)}`;
            }
        } else {
            return res.status(400).json({ error: 'Google Calendar not authorized. Please connect your account first.' });
        }

        event.status = 'upcoming';
        event.meetLink = meetLink;
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rejectSession = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Session not found' });

        // Verify the user rejecting is the organizer (alumni)
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to reject this session' });
        }

        event.status = 'rejected';
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const trackAttendance = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Session not found' });

        // Check if already tracked
        const alreadyAttended = event.attendance.some(a => a.studentId.toString() === req.user._id.toString());

        if (!alreadyAttended) {
            event.attendance.push({
                studentId: req.user._id,
                joinedAt: new Date()
            });
            await event.save();
        }

        res.status(200).json({ message: 'Attendance tracked', event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const submitRating = async (req, res) => {
    try {
        const { score, feedback } = req.body;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Session not found' });

        // Verify session is completed
        if (event.status !== 'completed') {
            return res.status(400).json({ error: 'Only completed sessions can be rated' });
        }

        // Verify student attended
        const attended = event.attendance.some(a => a.studentId.toString() === req.user._id.toString());
        if (!attended) {
            return res.status(403).json({ error: 'You can only rate sessions you attended' });
        }

        // Verify student hasn't rated yet
        const alreadyRated = event.ratings.some(r => r.studentId.toString() === req.user._id.toString());
        if (alreadyRated) {
            return res.status(400).json({ error: 'You have already rated this session' });
        }

        // Add rating to session
        event.ratings.push({
            studentId: req.user._id,
            score: Number(score),
            feedback
        });
        await event.save();

        // Update Alumni Rating Statistics
        const alumni = await User.findById(event.organizer);
        if (alumni) {
            alumni.ratingCount += 1;
            alumni.totalRating += Number(score);
            alumni.averageRating = alumni.totalRating / alumni.ratingCount;
            await alumni.save();
        }

        res.status(200).json({ message: 'Rating submitted successfully', averageRating: alumni?.averageRating });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createEvent, getEvents, registerForEvent, requestSession, acceptSession, rejectSession, trackAttendance, submitRating };
