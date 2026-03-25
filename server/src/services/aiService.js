const axios = require('axios');

/**
 * Service to interact with Grok AI (X.AI)
 * API is OpenAI-compatible
 */
class AIService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.baseUrl = 'https://api.groq.com/openai/v1';
        
        if (!this.apiKey || this.apiKey === 'your_groq_api_key') {
            console.warn('[AI Service] GROQ_API_KEY is missing or invalid in .env. AI features will fail.');
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
            
            Return ONLY a valid JSON object with these fields:
            - placementReadinessScore: (number 0-100)
            - feedback: (string summary)
            - suggestions: (array of strings)
            - matchDetails: (string)
            - keyStrengths: (array of strings)
            - missingKeywords: (array of strings)
            `;

            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'You are a professional AI Placement Coach. Respond only in pure JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1, // Lower temperature for more consistent JSON
                response_format: { type: 'json_object' }
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data.choices[0].message.content;
            return JSON.parse(content);
        } catch (error) {
            console.error('[AI Service] Resume analysis error:', error.response?.data || error.message);
            throw new Error('AI Resume Analysis failed. Please check your GROQ_API_KEY.');
        }
    }

    async getChatResponse(messages) {
        try {
            const response = await axios.post(`${this.baseUrl}/chat/completions`, {
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: 'You are an AI Placement Coach. Your goal is to help students prepare for interviews, improve their resumes, and build confidence. Be encouraging and practical.' },
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
            throw new Error('AI Chat response failed. Please check your GROQ_API_KEY.');
        }
    }
}

module.exports = new AIService();
