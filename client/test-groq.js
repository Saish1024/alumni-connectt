const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: 'your_groq_api_key',
    baseURL: 'https://api.groq.com/openai/v1',
});

openai.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    response_format: { type: 'json_object' },
    messages: [
        { role: 'system', content: 'You must output JSON.' },
        { role: 'user', content: 'Generate a JSON object with a single "questions" array containing 1 output question.' }
    ]
}).then(c => console.log(c.choices[0].message.content)).catch(e => console.log(e.message));
