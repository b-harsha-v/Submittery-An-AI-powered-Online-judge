const Submission = require('../models/Submission.js');
const Problem = require('../models/Problem.js');
const axios = require('axios');

// Helper function to handle Judge0 API calls
const callJudge0 = async (language, code, input) => {
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: { base64_encoded: 'false', fields: '*' },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
            language_id: getLanguageId(language),
            source_code: code,
            stdin: input
        }
    };
    const response = await axios.request(options);
    return response.data.token;
};

// Helper function to check Judge0 result
const checkJudge0Status = async (token) => {
    const options = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        params: { base64_encoded: 'false', fields: '*' },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
    };

    while (true) {
        const response = await axios.request(options);
        const statusId = response.data.status.id;
        if (statusId > 2) { // Statuses: 1-In Queue, 2-Processing, 3+-Finished
            return response.data;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
};

// Helper to map our language names to Judge0's language IDs
const getLanguageId = (language) => {
    switch (language) {
        case 'cpp': return 54;
        case 'java': return 62;
        case 'python': return 71;
        default: return null;
    }
};

// Controller for creating a graded submission
const createSubmission = async (req, res) => {
    const { language, code, problemId } = req.body;
    const userId = req.user._id;

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });
        
        const testCase = problem.hiddenTestCases[0];
        if (!testCase) return res.status(400).json({ message: 'No test cases' });

        const token = await callJudge0(language, code, testCase.input);
        const result = await checkJudge0Status(token);

        let finalVerdict = result.status.description;
        // Judge0's "Accepted" only means it ran successfully. We must verify the output.
        if (finalVerdict === 'Accepted') {
            if (result.stdout.trim() !== testCase.output.trim()) {
                finalVerdict = 'Wrong Answer';
            }
        }

        await Submission.create({
            userId, problemId, code, language,
            verdict: finalVerdict,
            output: result.stdout || result.stderr || result.compile_output,
        });

        res.status(201).json({ verdict: finalVerdict, output: result.stdout || result.stderr || result.compile_output });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Controller for running code with custom input
const runCustomCode = async (req, res) => {
    const { language, code, input } = req.body;
    try {
        const token = await callJudge0(language, code, input);
        const result = await checkJudge0Status(token);
        
        res.json({
            verdict: result.status.description,
            output: result.stdout || result.stderr || result.compile_output,
            executionTime: result.time,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error executing code', error: err.message });
    }
};
    
// Controller for fetching a user's submissions for a problem
const getProblemSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            userId: req.user._id,
            problemId: req.params.problemId
        }).sort({ createdAt: -1 }); // Sort by most recent

        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createSubmission, getProblemSubmissions, runCustomCode };