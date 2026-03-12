const Event = require('../models/Event');
const User = require('../models/User');
const ResumeReview = require('../models/ResumeReview');
const SessionRequest = require('../models/SessionRequest');
const mongoose = require('mongoose');

const getAvailableSessionRequests = async (req, res) => {
    try {
        const requests = await SessionRequest.find({ status: 'pending' })
            .populate('faculty', 'name email profileImage')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching available session requests:', error);
        res.status(500).json({ error: 'Server error while fetching available session requests' });
    }
};

const acceptSessionRequest = async (req, res) => {
    try {
        const { requestId, scheduledDate } = req.body;
        const alumniId = req.user._id;

        const request = await SessionRequest.findById(requestId).populate('faculty', 'name');
        if (!request) return res.status(404).json({ error: 'Session request not found' });
        if (request.status !== 'pending') return res.status(400).json({ error: 'Session request already accepted or cancelled' });

        // Generate mock link for now (matching eventController logic if no tokens)
        const meetLink = `https://meet.google.com/session-${Math.random().toString(36).substring(2, 10)}`;

        request.status = 'accepted';
        request.acceptingAlumni = alumniId;
        request.scheduledDate = scheduledDate || new Date(Date.now() + 86400000); // Default to tomorrow
        request.meetingLink = meetLink;
        await request.save();

        // Create an Event so it shows up in dashboards
        const event = new Event({
            title: `Session: ${request.topic}`,
            description: `Faculty requested session by ${request.faculty.name}. Topic: ${request.description}`,
            date: request.scheduledDate.toISOString().split('T')[0],
            time: "10:00", // Default time
            type: 'session',
            category: 'Mentoring',
            organizer: alumniId,
            meetLink,
            status: 'upcoming'
        });
        await event.save();

        res.json({ message: 'Session request accepted successfully', request, event });
    } catch (error) {
        console.error('Error accepting session request:', error);
        res.status(500).json({ error: 'Server error while accepting session request' });
    }
};

const getAlumniStats = async (req, res) => {
    try {
        const alumniId = req.user._id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // 1. Basic Stats (Top Cards)
        const allCompletedSessions = await Event.find({
            organizer: alumniId,
            status: 'completed'
        });

        const totalEarnings = allCompletedSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
        const sessionsDone = allCompletedSessions.length;

        const monthlyCompletedSessions = allCompletedSessions.filter(s => new Date(s.createdAt) >= startOfMonth);
        const monthlyEarnings = monthlyCompletedSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
        const monthlySessionsCount = monthlyCompletedSessions.length;

        // Avg Rating
        const user = await User.findById(alumniId);
        const avgRating = user.averageRating || 0;
        const ratingCount = user.ratingCount || 0;

        // Students Helped & Colleges
        const studentIds = [...new Set(allCompletedSessions.flatMap(s => s.attendees.map(id => id.toString())))];
        const studentsHelped = studentIds.length;

        // Count colleges from helped students
        const students = await User.find({ _id: { $in: studentIds } }, 'institution department');
        const collegesHelped = [...new Set(students.map(s => s.institution).filter(Boolean))].length;

        // 2. Earnings Trend (Last 7 Months)
        const earningsData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthSessions = allCompletedSessions.filter(s => {
                const sDate = new Date(s.createdAt);
                return sDate >= d && sDate < nextD;
            });
            const monthEarned = monthSessions.reduce((sum, s) => sum + (s.amount || 0), 0);
            earningsData.push({
                month: d.toLocaleString('default', { month: 'short' }),
                earned: monthEarned
            });
        }

        // 3. Sessions by Topic
        const topicMap = {};
        allCompletedSessions.forEach(s => {
            const cat = s.category || 'Mentoring';
            topicMap[cat] = (topicMap[cat] || 0) + 1;
        });
        const totalSessions = sessionsDone || 1;
        const topicData = Object.entries(topicMap).map(([name, count]) => ({
            name,
            value: Math.round((count / totalSessions) * 100)
        })).sort((a, b) => b.value - a.value);

        // 4. Upcoming Sessions (3)
        const upcomingSessions = await Event.find({
            organizer: alumniId,
            status: 'upcoming'
        }).populate('attendees', 'name').sort({ date: 1, time: 1 }).limit(3);

        const upcomingFormatted = upcomingSessions.map(s => ({
            id: s._id,
            student: s.attendees[0]?.name || 'Student',
            topic: s.title,
            date: s.date,
            time: s.time,
            type: s.paymentType,
            amount: s.amount || 0
        }));

        // 5. Pending Resume Reviews (3)
        const pendingReviews = await ResumeReview.find({
            alumni: alumniId,
            status: 'pending'
        }).populate('student', 'name institution department major').sort({ createdAt: -1 }).limit(3);

        const reviewsFormatted = pendingReviews.map(r => ({
            id: r._id,
            student: r.student?.name || 'Student',
            college: r.student?.institution || 'Unknown College',
            request: r.resumeName || 'Resume Review',
            time: formatTimeAgo(r.createdAt)
        }));

        res.status(200).json({
            topStats: {
                totalEarnings,
                monthlyEarnings,
                sessionsDone,
                monthlySessions: monthlySessionsCount,
                avgRating,
                ratingCount,
                studentsHelped,
                collegesHelped
            },
            earningsData,
            topicData,
            upcomingSessions: upcomingFormatted,
            pendingReviews: reviewsFormatted
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hrs ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " secs ago";
}

const getLegacyData = async (req, res) => {
    try {
        const alumniId = req.user._id;
        const allCompletedSessions = await Event.find({
            organizer: alumniId,
            status: 'completed'
        }).populate('attendees', 'name institution major');

        // 1. Calculating the Archetype
        const topicCounts = {};
        allCompletedSessions.forEach(s => {
            topicCounts[s.category] = (topicCounts[s.category] || 0) + 1;
        });
        const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mentoring';
        
        const archetypes = {
            'DSA & Algo': 'The Logic Architect',
            'System Design': 'The Infrastructure Titan',
            'Web Dev': 'The Full-Stack Alchemist',
            'Interview Prep': 'The Kingmaker',
            'Career Advice': 'The North Star',
            'Mentoring': 'The Legacy Builder'
        };
        const archetype = archetypes[topTopic] || 'The Visionary';

        // 2. Legacy Multiplier (Projected ROI)
        const sessionsCount = allCompletedSessions.length;
        const hoursCoded = sessionsCount * 1.5; // Assumption
        const projectedEconomicImpact = sessionsCount * 50000; // $50k per student influenced

        // 3. Chronicling the Future (Predictions)
        const futureYears = [2028, 2031, 2035, 2040];
        const studentNames = allCompletedSessions.flatMap(s => s.attendees.map(a => a.name));
        const uniqueStudents = [...new Set(studentNames)];
        
        const headlines = [
            { year: 2028, title: "The First Breakthrough", content: `${uniqueStudents[0] || 'A student'} credits your early guidance for their first Senior Engineer promotion at a FAANG company.` },
            { year: 2031, title: "The Startup Exit", content: `${uniqueStudents[1] || 'A mentee'} sells their startup for $50M, citing the 'Session on ${topTopic}' as the turning point.` },
            { year: 2035, title: "The Policy Shift", content: `${uniqueStudents[2] || 'A researcher'} becomes an industry lead, implementing the technical ethics you discussed years ago.` },
            { year: 2040, title: "The Global Legacy", content: `A generation of engineers influenced by your 'Legacy' now lead the global tech ecosystem.` }
        ];

        res.status(200).json({
            archetype,
            multiplier: {
                studentsHelped: uniqueStudents.length,
                projectedValue: projectsAmount(projectedEconomicImpact),
                hoursInvested: Math.round(hoursCoded)
            },
            headlines: headlines.slice(0, Math.max(1, Math.min(headlines.length, uniqueStudents.length || 1))),
            synthData: {
                pulseRate: Math.min(100, 60 + sessionsCount),
                color: topTopic === 'DSA & Algo' ? '#3b82f6' : '#8b5cf6'
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateMentoringSettings = async (req, res) => {
    try {
        const alumniId = req.user._id;
        const { sessionPrice, resumeReviewPrice, mentoringTopics, availability } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            alumniId,
            {
                $set: {
                    sessionPrice,
                    resumeReviewPrice,
                    mentoringTopics,
                    skills: mentoringTopics, // Keep skills in sync for search/display
                    availability
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Mentoring settings updated successfully',
            user: {
                sessionPrice: updatedUser.sessionPrice,
                resumeReviewPrice: updatedUser.resumeReviewPrice,
                mentoringTopics: updatedUser.mentoringTopics,
                availability: updatedUser.availability
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAlumniStats, getLegacyData, updateMentoringSettings };
