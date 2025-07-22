const { GoogleGenerativeAI } = require('@google/generative-ai');
const Problem = require('../models/Problem.js');


console.log('Attempting to use Gemini API Key:', process.env.GEMINI_API_KEY);
// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.explainProblem = async (req, res) => {
    try {
        const { problemId } = req.body;
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = `Explain the following programming problem in a simple and clear way, as if you were explaining it to a beginner. Focus on the core logic and what is being asked. Here is the problem statement:\n\n---\n\n${problem.statement}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.json({ explanation: text });
    } catch (error) {
        console.error('AI explanation error:', error);
        res.status(500).json({ message: 'Failed to get explanation from AI.' });
    }
};

// Add this to backend/controllers/aiController.js
exports.debugCode = async (req, res) => {
    try {
        const { problemId, userCode, language, verdict, actualOutput } = req.body;
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // For simplicity, we use the first test case for context.
        const testCase = problem.hiddenTestCases[0];

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = `
            You are an expert programming tutor. A student has submitted a solution to a programming problem, but it failed. Your task is to explain the mistake in a helpful and encouraging way without giving away the final correct code directly.

            Here is the context:
            - Problem Statement: "${problem.statement}"
            - Student's Code (in ${language}):
            \`\`\`${language}
            ${userCode}
            \`\`\`
            - Test Case Input: "${testCase.input}"
            - Expected Output: "${testCase.output}"
            - Student's Actual Output: "${actualOutput}"
            - Verdict: "${verdict}"

            Please explain what is likely wrong with the student's logic and provide a targeted hint to guide them toward the correct approach.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ explanation: text });
    } catch (error) {
        console.error('AI debug error:', error);
        res.status(500).json({ message: 'Failed to get debug explanation from AI.' });
    }
};



exports.reviewCode = async (req, res) => {
    try {
        const { language, code } = req.body;

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const prompt = `
            You are an expert code reviewer for a competitive programming platform.
            Analyze the following code written in ${language}.

            Provide a concise review focusing on:
            1.  **Correctness:** Are there any potential logic errors or bugs?
            2.  **Efficiency:** Can the time or space complexity be improved?
            3.  **Style and Readability:** Is the code clean, well-formatted, and easy to understand?

            Provide your feedback in clear, actionable points using markdown for formatting.

            Here is the code:
            \`\`\`${language}
            ${code}
            \`\`\`
        `;

        console.log("Sending request to Gemini API..."); 

        const result = await model.generateContent(prompt);
        console.log("Received response from Gemini API.");
        const text = result.response.text();

        res.json({ review: text });
    } catch (error) {
        console.error('AI review error:', error);
        res.status(500).json({ message: 'Failed to get code review from AI.' });
    }
};


// module.exports = { explainProblem, debugCode };