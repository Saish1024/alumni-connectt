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
            You are a strict Senior Technical Recruiter and Placement Expert.
            Analyze the following resume and evaluate its "Placement Readiness" on a scale of 0-100.
            
            SCORING RUBRIC (Strict):
            - 0-30: Poor (Missing basic info, no relevant skills, bad formatting)
            - 31-50: Below Average (Basic skills but lacks impact, projects, or clear focus)
            - 51-70: Average (Has potential, some relevant experience, but needs more quantifiable results)
            - 71-85: Above Average (Strong skills, good projects, ready for most junior/mid interviews)
            - 86-100: Exceptional (Top 1% candidate, clear impact, perfectly optimized)
            
            Resume Text:
            """${resumeText}"""
            
            Job Description (Optional Context):
            """${jobDescription || 'Not provided - evaluate general placement readiness'}"""
            
            CRITICAL EVALUATION STEPS:
            1. Scan for hard skills vs years of experience.
            2. Evaluate project complexity and quantifiable achievements.
            3. Check if the resume matches the provided Job Description (if any).
            4. Identify "Red Flags" (gaps, lack of detail, irrelevant content).
            
            Return ONLY a valid JSON object with NO markdown formatting:
            {
              "placementReadinessScore": number,
              "feedback": "critical 2-sentence summary of findings",
              "suggestions": ["specific actionable change", "another specific change"],
              "matchDetails": "how well the candidate fits the JD or general industry standards",
              "keyStrengths": ["skill/trait 1", "skill/trait 2"],
              "missingKeywords": ["keyword 1", "keyword 2"]
            }
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
                    { 
                        role: 'system', 
                        content: `You are an AI Placement Coach. Your goal is to help students prepare for interviews, improve their resumes, and build confidence.
                        
                        READABILITY RULES:
                        1. Use DOUBLE NEWLINES between paragraphs.
                        2. Use bullet points (•) or numbered lists (1.) for multiple tips.
                        3. Keep sentences concise.
                        4. Bold key terms using **markdown bold**.`
                    },
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
