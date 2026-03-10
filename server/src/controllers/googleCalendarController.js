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

        // Parse date and time correctly
        // sessionData.date: "2026-03-15", sessionData.time: "10:20" (from HTML5 inputs)
        // or sessionData.date: "Mar 15, 2026", sessionData.time: "10:20 AM"

        let startDateTimeStr;
        if (sessionData.date.includes('-')) {
            // HTML5 format: "2026-03-15T10:20:00"
            startDateTimeStr = `${sessionData.date}T${sessionData.time}:00`;
        } else {
            // "Mar 15, 2026 10:20 AM" -> parsed by JS Date
            const dummyDate = new Date(`${sessionData.date} ${sessionData.time}`);
            // Format as YYYY-MM-DDTHH:mm:ss manually to avoid UTC conversion
            const year = dummyDate.getFullYear();
            const month = String(dummyDate.getMonth() + 1).padStart(2, '0');
            const day = String(dummyDate.getDate()).padStart(2, '0');
            const hours = String(dummyDate.getHours()).padStart(2, '0');
            const minutes = String(dummyDate.getMinutes()).padStart(2, '0');
            startDateTimeStr = `${year}-${month}-${day}T${hours}:${minutes}:00`;
        }

        const durationMin = parseInt(sessionData.duration) || 60;
        const startTimestamp = new Date(startDateTimeStr).getTime();
        const endTimestamp = startTimestamp + durationMin * 60000;
        const endDateTimeObj = new Date(endTimestamp);

        const endYear = endDateTimeObj.getFullYear();
        const endMonth = String(endDateTimeObj.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDateTimeObj.getDate()).padStart(2, '0');
        const endHours = String(endDateTimeObj.getHours()).padStart(2, '0');
        const endMinutes = String(endDateTimeObj.getMinutes()).padStart(2, '0');
        const endDateTimeStr = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}:00`;

        const event = {
            summary: `Mentoring Session: ${sessionData.topic}`,
            description: `Mentoring session hosted on Alumni Connect platform.`,
            start: {
                dateTime: startDateTimeStr,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: endDateTimeStr,
                timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
                createRequest: {
                    requestId: `session-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
            attendees: [],
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
