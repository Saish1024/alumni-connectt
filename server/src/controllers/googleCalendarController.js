const { google } = require('googleapis');
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

/**
 * Create a Google Meet link for a session
 * @param {string} userId - The ID of the alumni/mentor
 * @param {Object} sessionData - { topic, date, time, duration }
 */
exports.createMeeting = async (userId, sessionData) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.googleTokens || !user.googleTokens.access_token) {
            throw new Error('User not authorized with Google Calendar');
        }

        oauth2Client.setCredentials(user.googleTokens);
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        // Parse date and time
        // sessionData.date: "Mar 15, 2026", sessionData.time: "5:00 PM"
        const startDateTime = new Date(`${sessionData.date} ${sessionData.time}`);
        const durationMin = parseInt(sessionData.duration) || 60;
        const endDateTime = new Date(startDateTime.getTime() + durationMin * 60000);

        const event = {
            summary: `Mentoring Session: ${sessionData.topic}`,
            description: `Mentoring session hosted on Alumni Connect platform.`,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: 'UTC',
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'UTC',
            },
            conferenceData: {
                createRequest: {
                    requestId: `session-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
            attendees: [], // Can add student email later if booked
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        return response.data.hangoutLink;
    } catch (error) {
        console.error('Error creating Google Meet:', error);
        throw error;
    }
};
