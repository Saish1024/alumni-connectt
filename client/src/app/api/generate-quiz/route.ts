import OpenAI from 'openai';
import { NextResponse } from 'next/server';

function getMockQuestions(topic: string, difficulty: string, numQ: number) {
    // Generate basic mock questions based on the topic.
    const mock = [];
    for (let i = 0; i < numQ; i++) {
        mock.push({
            q: `Sample ${difficulty} AI-generated question #${i + 1} about ${topic}?`,
            options: [`Correct Option`, `Wrong Option A`, `Wrong Option B`, `Wrong Option C`],
            correct: 0
        });
    }
    return mock;
}

export async function POST(req: Request) {
    try {
        const { topic, difficulty, numQ } = await req.json();

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.log("No GROQ_API_KEY found. Returning mock AI questions.");
            return NextResponse.json({ questions: getMockQuestions(topic, difficulty, numQ) }, { status: 200 });
        }

        const openai = new OpenAI({
            apiKey,
            baseURL: "https://api.groq.com/openai/v1"
        });

        const prompt = `Generate a coding/technical quiz with exactly ${numQ} questions about ${topic} at an ${difficulty} difficulty level. For each question, provide exactly 4 options and indicate the correct option's index (0 to 3). Only return a structural JSON array with the keys: "q" (string), "options" (array of exactly 4 strings), "correct" (number 0-3).`;

        const response = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical interviewer and quiz master. Always output your response wrapped in a JSON object with a single 'questions' array key containing the question objects."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const text = response.choices[0].message.content;
        if (!text) throw new Error("Empty response from AI");

        const parsed = JSON.parse(text);

        return NextResponse.json({ questions: parsed.questions });
    } catch (error: any) {
        console.error("AI Quiz Gen error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
