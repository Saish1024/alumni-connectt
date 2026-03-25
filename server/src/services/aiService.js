const axios = require('axios');

/**
 * Service to interact with Grok AI (X.AI)
 * API is OpenAI-compatible
 */
class AIService {
    constructor() {
        this.apiKey = process.env.GROK_API_KEY;
        this.baseUrl = 'https://api.x.ai/v1';
        
        if (!this.apiKey) {
            console.warn('[AI Service] GROK_API_KEY is missing in .env. AI features will fail.');
        }
    }

    async analyzeResume(resumeText, jobDescription = '') {
        try {
            const prompt = `
            You are an expert Placement Coach and Technical Recruiter.
            Analyze the following resume and compare it against the Job Description (if provided).
            
            Resume Text:
            ${resumeText}
            
            Job Description:
            ${jobDescription || 'Not provided'}
            
            Please provide a structured response in JSON format (do not include Markdown blocks) with the following fields:
            1. placementReadinessScore: A number from 0 to 100.
            2. feedback: A detailed string with overall advice.
            3. suggestions: An array of strings with specific improvements.
            4. matchDetails: A string explaining how well it matches the JD.
            5. keyStrengths: An array of strings highlighting strong points.
            6. missingKeywords: An array of strings highlighting keywords or skills to add.
            `;

            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
                model: 'grok-1', // or appropriate model name
                messages: [
                    { role: 'system', content: 'You are a professional AI Placement Coach.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' }
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('[AI Service] Resume analysis error:', error.response?.data || error.message);
            throw new Error('AI Resume Analysis failed.');
        }
    }

    async getChatResponse(messages) {
        try {
            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
                model: 'grok-1',
                messages: [
                    { role: 'system', content: 'You are an AI Placement Coach. Your goal is to help students prepare for interviews, improve their resumes, and build confidence for their careers. Be encouraging, professional, and practical.' },
                    ...messages
                ],
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('[AI Service] Chat error:', error.response?.data || error.message);
            throw new Error('AI Chat response failed.');
        }
    }
}

module.exports = new AIService();
