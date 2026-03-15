let google;
try {
    const googleapis = require('googleapis');
    google = googleapis.google;
} catch (error) {
    console.warn('googleapis not found, social auth features will be disabled.');
    // Mock google object to prevent crash
    google = {
        auth: {
            OAuth2: class {
                generateAuthUrl() { return '#'; }
                getToken() { throw new Error('Google Auth not available'); }
            }
        }
    };
}
const User = require('../models/User');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
);

exports.getAuthUrl = (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        state: req.query.userId // Pass user ID to associate token
    });

    res.redirect(url);
};

exports.googleCallback = async (req, res) => {
    const { code, state } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // In a real app, we would store tokens in the database for the user (state)
        // For this demo/MVP, we'll log it and redirect back to dashboard
        console.log('Successfully authorized Google Calendar:', tokens);

        // Update user with tokens if state (userId) is provided
        if (state) {
            await User.findByIdAndUpdate(state, {
                googleTokens: tokens
            });
        }

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        res.redirect(`${clientUrl}/dashboard/sessions?authorized=true`);
    } catch (error) {
        console.error('Error during Google Auth callback:', error);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        res.redirect(`${clientUrl}/dashboard/sessions?error=auth_failed`);
    }
};
