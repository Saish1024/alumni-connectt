const aiService = require('../services/aiService');
const pdf = require('pdf-parse');
const fs = require('fs');

exports.analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded.' });
        }

        const { jobDescription } = req.body;
        
        // Read the file and parse PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const resumeText = data.text;

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ error: 'Could not extract enough text from the resume. Please ensure it is a valid PDF.' });
        }

        // Call AI Service
        const analysis = await aiService.analyzeResume(resumeText, jobDescription);
        
        res.json(analysis);
    } catch (error) {
        console.error('Error in analyzeResume controller:', error);
        res.status(500).json({ error: error.message || 'Failed to analyze resume' });
    }
};

exports.chatWithCoach = async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format.' });
        }

        const response = await aiService.getChatResponse(messages);
        res.json({ content: response });
    } catch (error) {
        console.error('Error in chatWithCoach controller:', error);
        res.status(500).json({ error: error.message || 'Failed to get AI response' });
    }
};
